import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({
    timestamps: true,
})
export class User {

    @Prop({ required: true })
    name!: string;

    @Prop({
        required: true,
        unique: true,
    })
    email!: string;
}
export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);