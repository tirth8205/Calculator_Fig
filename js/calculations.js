// calculations.js

export function calculateTurnover(numEmployees, industry) {
    const industry_data = {
        "Manufacturing": {"turnover_rate": 0.1612, "turnover_cost": 32635},
        "Healthcare": {"turnover_rate": 0.3040, "turnover_cost": 51016},
        "Luxury Retail": {"turnover_rate": 0.5080, "turnover_cost": 20113},
        "Hospitality": {"turnover_rate": 0.3000, "turnover_cost": 22761},
        "Other": {"turnover_rate": 0.3400, "turnover_cost": 30614}
    };

    const data = industry_data[industry];

    const employeesConsideringLeaving = Math.round(numEmployees * data.turnover_rate);
    const employeesLeavingDueToWorkLifeBalance = Math.round(employeesConsideringLeaving / 3);
    const estimatedTurnoverCost = employeesLeavingDueToWorkLifeBalance * data.turnover_cost;

    return {
        employeesConsideringLeaving,
        employeesLeavingDueToWorkLifeBalance,
        estimatedTurnoverCost
    };
}