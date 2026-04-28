import { useSignout } from "@/services/firebaseAuth";

function Dashboard() {
  return (
    <div>
      <p>Dashboard</p>
      <button onClick={useSignout}>Logout</button>
    </div>
  );
}

export default Dashboard;
