import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/integrations/supabase/client';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

interface EvaluationResult {
  score: number;
  feedback: string;
  shouldReject: boolean;
}

const REFERENCE_ANSWERS = {
  question1: `Depreciation is a non-cash expense that impacts all three statements:
  - Income Statement: Reduces operating income by ₹10 Cr
  - Balance Sheet: Reduces PP&E (accumulated depreciation increases), reduces retained earnings
  - Cash Flow Statement: Added back to net income in operating activities (non-cash expense)
  Net effect: Reduces net income and equity, but no cash impact.`,
  
  question2: `Higher CFO than Net Income indicates:
  - Strong earnings quality (cash-backed profits)
  - Efficient working capital management (collecting receivables quickly, managing inventory well, delaying payables)
  - Potential aggressive revenue recognition being offset by actual cash collections
  - Could indicate declining growth (less investment in working capital)
  Overall, this is generally positive but needs context on growth stage.`,
  
  question3: `Current Ratio 2.5 vs Quick Ratio 0.8 indicates:
  - Significant inventory (2.5 - 0.8 = 1.7x inventory relative to current liabilities)
  - Potential liquidity concerns if inventory is slow-moving
  - Red flags: Inventory may be obsolete, overstocked, or hard to liquidate
  - Company heavily dependent on inventory sales for liquidity
  - Should investigate inventory turnover ratio and days inventory outstanding`,
  
  question4: `Scenarios for positive income but negative operating cash flow:
  1. Rapid growth in receivables: Booking revenue but not collecting cash (credit sales growing faster than collections)
  2. Inventory buildup: Purchasing inventory but not yet sold, tying up cash in working capital
  Other scenarios: Prepaid expenses, accrued revenue, significant non-cash income items being reversed in cash flow`,
  
  question5: `Increasing D/E (0.5 to 1.2) with increasing ROE (12% to 18%) suggests:
  - Company is successfully using financial leverage to boost returns
  - Leveraging effect: Borrowing at lower cost than return on assets
  - Increased financial risk: Higher debt obligations, interest coverage concerns
  - May indicate aggressive growth strategy or financial engineering
  - Need to assess: Interest coverage ratio, debt covenants, sustainability of returns
  - Risk-return tradeoff: Higher returns but more volatile, riskier capital structure`
};

const CASE_STUDY_ANSWERS = {
  case1: `The ₹200 Cr excess is recorded as Goodwill (intangible asset):
  - Balance Sheet: Goodwill of ₹200 Cr in assets
  - Future implications: Annual impairment testing required
  - If fair value < carrying value: Impairment charge hits income statement
  - Other intangibles (patents, trademarks, customer relationships) might be separately identified
  - Goodwill is not amortized but tested for impairment annually`,
  
  case2: `Key questions and red flags:
  - Inventory valuation method: FIFO vs LIFO? Change in method?
  - Pricing power: Can they pass costs to customers?
  - Gross margin stability suspicious: Should decline with 40% cost increase unless pricing increased proportionally
  - Potential issues: Channel stuffing, obsolete inventory not written down, aggressive revenue recognition
  - Check: Inventory turnover ratio, days inventory outstanding, compare to industry
  - Investigate: Are they building inventory ahead of expected sales?`,
  
  case3: `Assessment framework:
  - Burn rate analysis: How long until cash runs out?
  - Unit economics: CAC (Customer Acquisition Cost) vs LTV (Lifetime Value)
  - Flat gross margins concerning: No operating leverage, scaling issues
  - Revenue growth without margin expansion: Buying growth, not sustainable
  - Path to profitability: When will operating leverage kick in?
  - Comparable analysis: Similar companies' trajectories
  - Bubble indicators: Valuation disconnect from fundamentals, cash burn unsustainable
  - Viable if: Clear path to profitability, strong unit economics, defensible competitive advantage`,
  
  case4: `Valuation gap justifications:
  1. Growth rates: Company X has higher revenue/EBITDA growth prospects
  2. Capital intensity: Company Y requires more capex, lower free cash flow conversion
  3. Working capital efficiency: Company X has better cash conversion cycle
  4. Market position: Company X has stronger competitive moat, brand value
  5. Management quality: Better capital allocation track record
  6. Margin expansion potential: Company X has more operating leverage
  7. Geographic mix: Better exposure to high-growth markets
  8. E-commerce penetration: Higher online sales, better margins`
};

export async function evaluateApplication(applicationId: string): Promise<EvaluationResult> {
  try {
    // Fetch application data
    const { data: application, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (error || !application) {
      throw new Error('Application not found');
    }

    // Check if already evaluated
    if (application.is_evaluated) {
      return {
        score: application.evaluation_score || 0,
        feedback: application.evaluation_feedback || 'Already evaluated',
        shouldReject: application.status === 'rejected'
      };
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    });

    // Prepare evaluation prompt
    const prompt = `You are an expert financial analyst evaluating student responses for a finance society induction. Be lenient and give credit for partially correct or conceptually sound answers. Evaluate the following answers and provide:
1. A score out of 100 for each answer
2. Overall feedback
3. Whether the application should be rejected (if average score < 30%)

BASIC QUESTIONS:

Question 1: Depreciation flow through financial statements
Reference Answer: ${REFERENCE_ANSWERS.question1}
Student Answer: ${application.assets_equity_answer}

Question 2: Cash Flow from Operations vs Net Income analysis
Reference Answer: ${REFERENCE_ANSWERS.question2}
Student Answer: ${application.financial_statements_answer}

Question 3: Liquidity ratios analysis (Current vs Quick ratio)
Reference Answer: ${REFERENCE_ANSWERS.question3}
Student Answer: ${application.net_worth_answer}

Question 4: Positive income but negative cash flow scenarios
Reference Answer: ${REFERENCE_ANSWERS.question4}
Student Answer: ${application.balance_income_difference}

Question 5: Leverage and ROE relationship
Reference Answer: ${REFERENCE_ANSWERS.question5}
Student Answer: ${application.pe_pb_ratio_answer}

CASE STUDIES:

Case Study 1: M&A and Goodwill accounting
Reference Answer: ${CASE_STUDY_ANSWERS.case1}
Student Answer: ${application.loan_transaction_answer}

Case Study 2: Inventory and margin analysis
Reference Answer: ${CASE_STUDY_ANSWERS.case2}
Student Answer: ${application.life_annual_report_answer}

Case Study 3: Startup valuation and cash flow analysis
Reference Answer: ${CASE_STUDY_ANSWERS.case3}
Student Answer: ${application.tinder_portfolio_answer}

Case Study 4: Valuation multiples comparison
Reference Answer: ${CASE_STUDY_ANSWERS.case4}
Student Answer: ${application.stock_market_explanation}

Please respond in JSON format:
{
  "scores": [score1, score2, score3, score4, score5, case1, case2, case3, case4],
  "averageScore": number,
  "feedback": "detailed feedback on strengths and weaknesses",
  "shouldReject": boolean (true if averageScore < 30)
}

Criteria for scoring:
- Conceptual understanding (50%) - Give credit for showing basic understanding
- Effort and thought process (25%) - Reward genuine attempts
- Practical application (15%) - Partial credit for related examples
- Clarity of explanation (10%)

Be lenient and encouraging. Give partial credit for somewhat correct answers. Only completely irrelevant or nonsensical answers should score below 15.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse evaluation response');
    }
    
    const evaluation = JSON.parse(jsonMatch[0]);

    // Update database
    const updateData: any = {
      is_evaluated: true,
      evaluation_score: evaluation.averageScore,
      evaluation_feedback: evaluation.feedback,
      evaluated_at: new Date().toISOString()
    };

    // Auto-reject if score < 30%
    if (evaluation.shouldReject) {
      updateData.status = 'rejected';
      updateData.admin_review = `Auto-rejected: Score ${evaluation.averageScore}% (< 30% threshold). ${evaluation.feedback}`;
      updateData.reviewed_at = new Date().toISOString();
      updateData.reviewed_by = 'AI Auto-Evaluation';
    }

    await supabase
      .from('applications')
      .update(updateData)
      .eq('id', applicationId);

    return {
      score: evaluation.averageScore,
      feedback: evaluation.feedback,
      shouldReject: evaluation.shouldReject
    };
  } catch (error) {
    console.error('Evaluation error:', error);
    throw error;
  }
}

export async function evaluateAllUnevaluated(): Promise<{
  total: number;
  evaluated: number;
  rejected: number;
  errors: number;
}> {
  try {
    // Fetch all unevaluated applications
    const { data: applications, error } = await supabase
      .from('applications')
      .select('id')
      .eq('is_evaluated', false);

    if (error) throw error;

    const total = applications?.length || 0;
    let evaluated = 0;
    let rejected = 0;
    let errors = 0;

    // Evaluate each application
    for (const app of applications || []) {
      try {
        const result = await evaluateApplication(app.id);
        evaluated++;
        if (result.shouldReject) rejected++;
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        console.error(`Failed to evaluate ${app.id}:`, err);
        errors++;
      }
    }

    return { total, evaluated, rejected, errors };
  } catch (error) {
    console.error('Bulk evaluation error:', error);
    throw error;
  }
}
