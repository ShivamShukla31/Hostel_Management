import mongoose from "mongoose";
import generateTicketId from "../utils/generateTicketId.js";

// 1️⃣ First, define schema
const problemSchema = new mongoose.Schema({
    tokenId: {
        type: String,
        unique: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    hostel: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    problemImage: {
        type: String,
        default: null
    },
    department: {
        type: String,
        enum: ['Electrical', 'Carpenter', 'Plumbing', 'Cleaning'],
        required: true
    },
    assignedWorker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    status: {
        type: String,
        enum: [
            'Pending',
            'Approved by Rector',
            'Assigned to Worker',
            'In Progress',
            'Completed',
            'Closed'
        ],
        default: 'Pending'
    },
    history: [
        {
            action: String,
            updatedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, { timestamps: true });

// 2️⃣ Then, add pre-save middleware
problemSchema.pre("save", function(next) {
    if (!this.tokenId) {
        this.tokenId = generateTicketId();
    }
    next();
});
const Problem = mongoose.model("Problem", problemSchema);
// 3️⃣ Export model
export { Problem };