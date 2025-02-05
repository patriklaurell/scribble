import Sidebar from "@/components/Sidebar";
import Editor from "@/components/Editor";

export default function Index() {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <Editor />
    </div>
  );
}