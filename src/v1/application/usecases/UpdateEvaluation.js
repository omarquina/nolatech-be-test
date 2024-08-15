export class UpdateEvaluation {
    repository;

    constructor(repository) {
        this.repository = repository;
    }

    async execute(user, dto) {
        this.preprocessData(user, dto);
        //console.debug("Update execute %o",dto)
        const evaluation = await this.searchById(dto.id);
        //console.dir(evaluation)
        this.updateData(evaluation, dto);
        await this.save(evaluation);
        return evaluation;
    }

    preprocessData(user, dto) {
        if (user.role !== "manager")
            throw new Error("User role is not granted to crate evaluations");
    }

    async searchById(id) {
        //console.debug(id);
        const result = await this.repository.evaluations.searchById(id);
        //console.debug("Result: %o", result);
        // const evaluation = new Evaluation(result)
        // evaluation.questions = result.questions.map(_q => {
        //   const question = new Question(_q)
        //   question.answers = _q.answers.map(_a => {
        //     return new Answer(_a)
        //   })
        //   return question;
        // })
        //console.dir(evaluation)
        return result;
    }

    updateData(evaluation, dto) {
        evaluation.setValues(dto);
        //console.debug("UpdateData: %o", dto);
        dto.questions.forEach((question) => {
            const _q = evaluation.questions.filter((q) => q.id === question.id)[0];
            //console.debug("Update Data _q: %o", _q);
            if (_q) {
                question.setValues(question);
                _q.answers.forEach((answer) => {
                    const _a = _q.answers.filter((item) => item.id === answer.id)[0];
                    //console.dir(_a);
                    _a && _a.setValues(answer) && _q.answers.push(_a);
                });
                evaluation.questions.push(_q);
            }
        });
    }

    async save(evaluation) {
        await this.repository.evaluations.save(evaluation);
    }
}

