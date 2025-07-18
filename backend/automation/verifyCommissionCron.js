import { User } from "../models/userSchema.js";
import { PaymentProof } from "../models/commissionProofSchema.js";
import { Commission } from "../models/commissionSchema.js";
import cron from "node-cron";
import { sendEmail } from "../utils/sendEmail.js";

export const verifyCommissionCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    const approvedProofs = await PaymentProof.find({ status: "Approved" });

    for (const proof of approvedProofs) {
      try {
        const user = await User.findById(proof.userId);
        if (!user) continue;

        const deductAmount = Math.min(proof.amount, user.unpaidCommission);

        const updatedUserData = await User.findByIdAndUpdate(
          user._id,
          { $inc: { unpaidCommission: -deductAmount } },
          { new: true }
        );

        await PaymentProof.findByIdAndUpdate(proof._id, {
          status: "Settled",
        });

        await Commission.create({
          amount: deductAmount,
          user: user._id,
        });

        const settlementDate = new Date().toDateString();

        const subject = `Your Payment Has Been Successfully Verified And Settled`;
        const message = `Dear ${user.userName},\n\nWe are pleased to inform you that your recent payment has been successfully verified and settled.\n\nPayment Details:\nAmount Settled: ₹${deductAmount}\nRemaining Unpaid Amount: ₹${updatedUserData.unpaidCommission}\nSettlement Date: ${settlementDate}\n\nThank you for your cooperation.\n\nBest regards,\nAyush Auction Team`;

        await sendEmail({ email: user.email, subject, message });

        console.log(`Commission ₹${deductAmount} settled for user ${user.email}`);
      } catch (error) {
        console.error(`Error settling commission for ${proof.userId}: ${error.message}`);
      }
    }
  });
};
