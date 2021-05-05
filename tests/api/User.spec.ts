const describeif = condition => condition ? describe : describe.skip;

describeif(process.env.CI)("should ", () => {
    it("should", () => {
        console.log(1);
    });
});
