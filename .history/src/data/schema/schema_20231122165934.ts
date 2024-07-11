import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLString,
  GraphQLObjectType as ObjectType,
} from "graphql";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import bcrypt from "bcryptjs";
import UserType from "../types/userType";
import UserCommonType from "../types/userCommonType";
import comparePassword from "../utils/comparePassword";
import transporter from "../utils/sendEmail";

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    //Get Users data
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        const data = User.find();
        console.log(data);
        return data;
      },
    },
    //Get User Profile
    user: {
      type: UserType,

      args: {
        _id: { type: GraphQLID },
      },

      async resolve(parent, args, req) {
        const data = await User.findById(args._id);
        console.log(data);
        return data;
      },
    },
  },
});

const RootMutations = new GraphQLObjectType({
  name: "RootMutations",
  fields: {
    //Create User

    addUser: {
      type: UserCommonType,

      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
        contactNumber: { type: GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args, req) {
        const { name, email, password, contactNumber } = args;
        const existingUser = await User.findOne({
          $or: [{ email }, { contactNumber }],
        });

        if (existingUser) {
          return {
            errorMessage: "User already Exists",
            status: 400,
          };
        }

        const user = new User({
          name: args.name,
          email: args.email,
          password: await bcrypt.hash(args.password, 10),
          contactNumber: args.contactNumber,
        });
        console.log(user);
        const token = jwt.sign({ id: user._id }, `${process.env.JWT_CODE}`);
        user.emailVerify_token = token;

        user.save();
        const data = {
          from: process.env.USER,
          to: "hetanshishah@gmail.com",
          Text: "Account Verification link",
          html: `<h2>Account verification</h2><p>Register user Name<b>-${user.name}</b></p> <p>Verification Token:--</p> ${token}`,
        };
        transporter.sendMail(data);

        console.log(user);
        return {
          result: {
            email: user.email,
            name: user.name,
            password: user.password,
            contactNumber: user.contactNumber,
          },

          status: 200,
        };
      },
    },

    Email_verify: {
      type: UserCommonType,

      args: {
        token: { type: GraphQLString },
        email: { type: GraphQLString },
      },

      async resolve(args, data: any) {
        // if (!token) {
        //   throw new Error("Token is not found");
        // }
        // console.log(token);
        // const user = await User.findOne({
        //   $or: [{ email }],
        // });
        if (!data.token) {
          throw new Error("Token is not found");
        }

        const user = await User.findOne({ $or: [{ email: data.email }] });

        if (!user) {
          throw new Error("Invalid email");
        } else if (user.is_Verified) {
          throw new Error("Admin has been already verified. please login ");
        } else {
          user.is_Verified = true;
          await user.save((err) => {
            if (err) {
              throw new Error(err.message);
            } else {
              return args.nam;
            }
          });
        }
      },
    },

    //Forgot password
    // ForgotPassword: {
    //   type: UserCommonType,

    //   args: {
    //     email: { type: GraphQLString },
    //   },

    //   async resolve(args, data: any) {
    //     const user: any = User.findOne({ $or: [{ email: data.email }] });

    //     if (!user) {
    //       throw new Error("Invalid email");
    //     }

    //     const token = jwt.sign(
    //       { id: user._id },
    //       `${process.env.RESET_PASS_CODE}`
    //     );

    //     user.resetPassword_token = token;
    //     await user.save();

    //     const list = {
    //       from: process.env.USER,
    //       to: "hetanshishah876@gmail.com",
    //       Text: "Reset Password link",
    //       html: `<h2>Reset Password</h2><p>Reset Password User name:---<b>-${user.name}</b></p> <p>Reset Password Token:--</p> ${token}`,
    //     };
    //     transporter.sendMail(list);

    //     return {
    //       result: {
    //         email: user.email,
    //         name: user.name,
    //         password: user.password,
    //         contactNumber: user.contactNumber,
    //       },
    //       status: 200,
    //     };
    //   },
    // },

    //Login User
    Login: {
      type: UserCommonType,

      args: {
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
      },

      async resolve(parent, args, req, res: any) {
        const { email, password } = args;
        const user = await User.findOne({
          $or: [{ email }],
        });

        if (!user) {
          return {
            errorMessage: "Invalid email",
            status: 400,
          };
        }

        if (!user.password) {
          return {
            errorMessage: "Password  does not exist",
          };
        }
        console.log(user.password, "password")

        if (!(await comparePassword(password, user.password))) {
          return {
            errorMessage: "Invalid password",
            status: 400,
          };
        }
        if (!user.is_Verified) {
          throw new Error(
            "Your Email has not been verified. Please click on resend"
          );
        }
        const token = jwt.sign({ _id: user._id }, `${process.env.JWT_CODE}`);
        console.log(user, token);

        return {
          token,
          result: {
            email: user.email,
            password: user.password,
          },
          status: 200,
        };
      },
    },

    //Delete User
    DeleteUser: {
      type: UserType,
      args: {
        _id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return User.findByIdAndDelete(args._id);
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutations,
});

export default schema;
