import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
    type: { type: String, required: true },
    interest_rate: { type: Number, required: true }
});

const Loan = mongoose.model("Loan", loanSchema);

export default Loan;
