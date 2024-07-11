import { GraphQLNonNull, GraphQLString } from "graphql";
import User from "../../models/userModel";
import UserType from "../../types/userType";

const User_register = {
  type: UserType,
  args: {
    name: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    contactNumber: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve(args: any) {
    const user = new User({
      name: args.name,
      email: args.email,
      password: args.password,
      contactNumber: args.contactNumber,
    });
    console.log(user);
    return user.save();
  },
};

//   const user = new User({
//     name: args.name,
//     email: args.email,
//     password: args.password,
//     contactNumber: args.contactNumber,
//   });
//   console.log(user);
//   return user.save();
// } catch (err) {
//   return response.json(err);
// }

export default User_register;
