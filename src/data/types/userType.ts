import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLInt as IntType,
} from "graphql";
const UserType = new ObjectType({
  name: "UserType",
  fields: {
    _id: { type: StringType },
    name: { type: StringType },
    email: { type: StringType },
    password: { type: StringType },
    contactNumber: { type: StringType },
  },
});
export default UserType;
