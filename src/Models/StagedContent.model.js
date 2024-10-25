import mongoose from "mongoose";

const stagedcontentSchema = new mongoose.Schema(
  {
    Company_Name: {
      type: String,
      required: true,
    },
    Content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    Sector: {
      type: String,
      required: true,
    },
    Industry: {
      type: String,
      ref: "Industry",
      required: true,
    },
    Type: {
      type: String,
      enum: ["IPO", "ARTICLE"],
      required: true,
    },
    Start_date: {
      type: Date,
      //validator to check if the doc  is of type IPO the this field is required
      validate: {
        validator: function (v) {
          return this.Type === "IPO" ? v != null : true;
        },
        message: "Start date is required for IPO",
      },
    },
    End_date: {
      type: Date,
      //validator to check if the doc  is of type IPO the this field is required
      validate: {
        validator: function (v) {
          return this.Type === "IPO" ? v != null : true;
        },
        message: "End date is required for IPO",
      },
    },
    Listing_date: {
      type: Date,
      //validator to check if the doc  is of type IPO the this field is required
      validate: {
        validator: function (v) {
          return this.Type === "IPO" ? v != null : true;
        },
        message: "Listing date is required for IPO",
      },
    },
    Category: {
      type: String,
      enum: ["SME", "NON-SME"],
      //validator to check if the doc  is of type IPO the this field is required
      validate: {
        validator: function (v) {
          return this.Type === "IPO" ? v != null : true;
        },
        message: "Category is required for IPO",
      },
    },
    Author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    View: {
      type: Number,
      default: 0,
    },
    Status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    OriginalContentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const StagedContent = mongoose.model("StagedContent", stagedcontentSchema);

export default StagedContent;
