import { User, Userex, UserStore} from "../../models/users"

const UserStoreInstance = new UserStore()

describe("User Model", () => {
  const user: User = {
    firstname: "Hans",
    lastname: "Meier",
    password: "password123"
  }

  async function createUser (user: User) {
    return UserStoreInstance.create(user)
  }

  async function deleteUser (id: number) {
    return UserStoreInstance.delete(id)
  }

  it("should have an index method", () => {
    expect(UserStoreInstance.index).toBeDefined()
  })

  
  it("should have a create method", () => {
    expect(UserStoreInstance.create).toBeDefined()
  })

  it("should have a remove method", () => {
    expect(UserStoreInstance.delete).toBeDefined()
  })

  it("create method should create a user", async () => {
    const createdUser : Userex  = await createUser(user)
   
   
    const firstname = createdUser.firstname
    const lastname = createdUser.lastname
    if (createdUser) {
      expect(firstname).toBe(user.firstname)
      expect(lastname).toBe(user.lastname)
    }
 await deleteUser(createdUser.user_id!)
    
  })

  it("index method should return a list of users", async () => {
    const createdUser: Userex = await createUser(user)
 
    const userList = await UserStoreInstance.index()

    expect(userList).toEqual([createdUser]);
await deleteUser(createdUser.user_id!)
    
  })

  it("remove method should remove the user", async () => {
    const createdUser: Userex = await createUser(user)

   await deleteUser(createdUser.user_id!)

    const userList = await UserStoreInstance.index()

    expect(userList).toEqual([])
  })

  it("authenticates the user with a password", async () => {
    const createdUser: User = await createUser(user)

    const userFromDb = await UserStoreInstance.authenticate(user.firstname,user.lastname, user.password!)

    if (userFromDb) {
      const {firstname, lastname} = userFromDb

     
      expect(firstname).toBe(user.firstname)
      expect(lastname).toBe(user.lastname)
    }

    await deleteUser(createdUser.id!)
  })
})
