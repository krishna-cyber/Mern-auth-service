import mongoose, { Document } from "mongoose";

interface TenantsDocument extends Document {
  name: string;
  address: string;
}

const tenantSchema = new mongoose.Schema<TenantsDocument>(
  {
    name: {
      type: String,
      required: true,
      maxlength: 30,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Tenants = mongoose.model<TenantsDocument>("Tenant", tenantSchema);

export { Tenants, tenantSchema, TenantsDocument };
