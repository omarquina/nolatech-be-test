

export class UpdateQuestion {
    repository;

    constructor(repository) {
        this.repository = repository;
    }

    async execute(user, dto) {
        this.preprocessData(user, dto);
        //console.debug("Update Question execute %o",dto)
        const question = await this.searchById(dto.id);
        //console.dir(question)
        this.updateData(question, dto);
        await this.save(question);
        //console.debug("UpdateQuestion before return %o", question)
        return question;
    }

    preprocessData(user, dto) {
        if (user.role !== "manager")
            throw new Error("User role is not granted to update questions");
    }

    async searchById(id) {
        const result = await this.repository.questions.searchById(id);
        return result;
    }

    updateData(question, dto) {
        question.setValues(dto);
        dto.answers.forEach((answer) => {
            const _a = question.answers.filter((item) => item.id === answer.id)[0];
            _a && _a.setValues(answer);
        });
    }

    async save(question) {
        await this.repository.evaluations.saveQuestion(question);
    }
}

