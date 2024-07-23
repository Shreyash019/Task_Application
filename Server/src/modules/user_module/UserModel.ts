import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from "bcryptjs";

// Define the UserAccount interface to represent the structure of an admin account
type ProfilePicture = {
    public_id: string,
    url: string,
    filetype: string,
}
interface User extends Document {
    googleId: string,
    username: string,
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    createdAt: Date;
    profilePicture: ProfilePicture
}

const UserAccountSchema: Schema = new Schema(
    {
        googleId: { 
            type: String, 
            unique: true, 
            sparse: true 
        },
        username: { 
            type: String,
            select: false 
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            // required: true, // Making Optional as google signup/login is there
            select: false
        },
        profilePicture: {
            type: Object, default: {
                public_id: "demo",
                url: "https://www.pngkey.com/png/full/72-729716_user-avatar-png-graphic-free-download-icon.png",
                filetype: "image"
            }
        }
    },
    {
        timestamps: true
    }
)

UserAccountSchema.pre("save", async function (this: User, next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

UserAccountSchema.methods.correctPassword = async function (candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Create and export the AdminAccount model based on the schema
const UserModel = mongoose.model<User>('UserAccount', UserAccountSchema);

export default UserModel;