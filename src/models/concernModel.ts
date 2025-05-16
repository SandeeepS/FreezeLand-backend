import mongoose, { Schema, Document, Model } from "mongoose";

export interface Iconcern extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  image: [];
  serviceId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  defaultAddress: mongoose.Types.ObjectId;
  orderId:mongoose.Types.ObjectId;
  discription: string;
  locationName: object;
  status: string;
  currentMechanicId: mongoose.Types.ObjectId | null;
  acceptedAt: Date;
  workHistory: [
    {
      mechanicId: mongoose.Types.ObjectId;
      status: string;
      acceptedAt: Date;
      canceledAt: Date;
      reason: string;
      canceledBy: string;
    }
  ];

  userCancellation: {
    canceledAt: Date;
    reason: string;
  };
  needsReassignment: boolean;
  workDetails: [
    {
      description: string;
      amount: number;
      addedAt: Date;
    }
  ];
  chatId?: mongoose.Types.ObjectId;
  isBlocked: boolean;
  isDeleted: boolean;
}

const concernSchema: Schema<Iconcern> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: [],
      required: false,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    defaultAddress: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    orderId:{
      type:mongoose.Schema.Types.ObjectId,
      default: null
    },
    discription: {
      type: String,
      required: true,
    },
    locationName: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "onProcess",
        "completed",
        "cancelled",
        "canceled_by_user",
        "canceled_by_mechanic",
        "pending_reassignment",
      ],
      default: "pending",
    },
    currentMechanicId: {
      type: mongoose.Types.ObjectId,
      default: null,
    },
    acceptedAt: {
      type: Date,
    },
    workHistory: [
      {
        mechanicId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        status: {
          type: String,
          enum: ["accepted", "canceled", "completed"],
          required: true,
        },
        acceptedAt: {
          type: Date,
          required: false,
        },
        canceledAt: {
          type: Date,
          default: null,
        },
        reason: {
          type: String,
          default: null,
        },
        canceledBy: {
          type: String,
          enum: ["user", "mechanic", null],
          default: null,
        },
      },
    ],
    userCancellation: {
      canceledAt: {
        type: Date,
        default: null,
      },
      reason: {
        type: String,
        default: null,
      },
    },
    needsReassignment: {
      type: Boolean,
      default: false,
    },
    workDetails: [
      {
        description: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    chatId: {
      type: mongoose.Types.ObjectId,
      required: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const concernModel: Model<Iconcern> = mongoose.model<Iconcern>(
  "Concerns",
  concernSchema
);
export default concernModel;
