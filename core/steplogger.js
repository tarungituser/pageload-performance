

function createStep(step)
{
    const mystep = allure.createStep(step, () => {
       })
       mystep()

}

module.exports.createStep=createStep;