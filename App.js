import express from 'express';
import { getAllUsers,getUser,createUser, deleteUser,updateUser} from './database.js';
import cors from 'cors';
const PORT = process.env.PORT || 8080
const app = express();
app.use(cors());

//   write error handleling middle ware.............
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

//   body parser middleware if it is not written then server not identify body....
app.use(express.json());

app.get("/user_info", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users); // Sending JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/user_info/:id", async (req, res) => {
  try {
    const userId = req.params.id; // Get the user ID from the URL parameter
    const user = await getUser(userId); // Replace with your actual function to fetch user by ID
    
    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.json(user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});  

app.post("/user_info", async (req, res) => {
  try {
    const { name, email, phone, reservation_date, reservation_time, number_of_guests } = req.body;
    const newUser = await createUser(name, email, phone, reservation_date, reservation_time, number_of_guests); 
    // Extract the ID of the newly created user
    const userId = newUser.id;

    // Respond with a success message and the user's ID
    res.json({ message: "User created successfully", userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" + error});
  } 
});

app.delete("/user_info/:id", async (req, res) => {
  try {
      const userId = req.params.id;
      await deleteUser(userId); // Replace with your actual function to delete user

      res.json("User deleted successfully");
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error: " + error });
  }
});

app.put("/user_info/update/:id", async (req, res) => {
  try {
    const userId = req.params.id; // ID from the URL parameter
    // const authenticatedUserId = req.user.id; // ID of the authenticated user (from authentication process)

    // if (userId !== authenticatedUserId) {
    //   // User is not authorized to update this data
    //   return res.status(403).json({ error: "Unauthorized access" });
    // }

    const { name, email, phone, reservation_date, reservation_time, number_of_guests } = req.body;

    // Use the updateUser function from your database.js file
    const updatedUser = await updateUser(userId, name, email, phone, reservation_date, reservation_time, number_of_guests);

    res.json("User information updated successfully" + updateUser);
    console.log(updateUser)
    if (updatedUser) {
      res.json("User information updated successfully");
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error: " + error });
  }
});



app.listen(PORT,()=>{
  console.log("server is runing on port 8080")
})