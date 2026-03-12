import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import DashboardView from './DashboardView';
import LoginView from './LoginView';

function App(){
  const [userId, setUserId] = useState(null);
  const[tasks, setTasks] = useState([]);
  const[showmodal, setshowmodal] = useState(false);
  const[taskdata, settaskdata] = useState({title: '', description: '', deadline: ""});
  const[isEditing, setisEditing] = useState(false);
  const[currentTaskID, setcurrentTaskID] = useState(null);
  const[sortBy, setsortBy] = useState("deadline");

  const baseUrl = "http://localhost:5093/api/Todo";

  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);


  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${baseUrl}/user/${userId}`);
      setTasks(response.data);
    } catch (error) {
      console.error("Veriler Çekilemedi: ", error);
    }
  };

  const handleLoginSuccess = (id) => {
    localStorage.setItem("userId", id); // ID'yi tarayıcı hafızasına al
    setUserId(id); 
  };

  const handleLogout = () => {
    localStorage.removeItem("userId"); // Hafızayı temizle
    setUserId(null); 
    setTasks([]);
  };

  //fonksiyonlar 

  const openAddModal = () => { 
    setisEditing(false); 
    settaskdata({ title: "",description: "", deadline: "" }); 
    setshowmodal(true); 
  }

  const saveTask =async () => { //post için 
    if(!taskdata.title) return alert("Başlık boş olamaz!");
    const newTask = {
      title: taskdata.title,
      description: taskdata.description,
      deadline: taskdata.deadline,
      isDone: false
    }; 

    try {
      await axios.post(`${baseUrl}/${userId}`, newTask);
      await fetchTasks(); 
      setshowmodal(false); 
      settaskdata({title: '', description: '', deadline: ""}); 
    } catch (error) {
      console.error("Görev Eklenemedi: ", error);
    }};

  const deleteTask = async (id) => { //delete id
    if(window.confirm("Bu görevi silmek istediğinize emin misiniz?")) {
      try {
        await axios.delete(`${baseUrl}/${id}`); 
        fetchTasks(); 
      } catch (error) {
        console.error("Görev Silinemedi: ", error);
      }
    }
  };

  const clearAll = async () => { //delete all
    if(window.confirm("Tüm görevleri silmek istediğinize emin misiniz?")) {
      try {
        await axios.delete(`${baseUrl}/ClearAll/${userId}`);
        setTasks([]); 
        fetchTasks(); 
      } catch (error) {
        console.error("Görevler Silinemedi: ", error);
      }
    }};

    const clearCompleted = async () => { //Delete completed
      if(window.confirm("Tamamlanan görevleri silmek istediğinize emin misiniz?")) {
        try {
          await axios.delete(`${baseUrl}/ClearCompleted/${userId}`);
          setTasks(tasks.filter(t=> !t.isDone)); 
          fetchTasks(); }
          catch(error){
          console.error("Görevler Silinemedi: ", error);
        }}};

    const openEditModal = (task) =>{ //update
      setisEditing(true); 
      setcurrentTaskID(task.id); 
      settaskdata({ title: task.title,
         description: task.description, 
         deadline: task.deadline });
      setshowmodal(true); 
    };

    const updateTask = async () => {
      try {
      await axios.put(`${baseUrl}/${currentTaskID}`, taskdata);
      await fetchTasks();
      setshowmodal(false);
      settaskdata({ title: '', description: '', deadline: "" });
      setisEditing(false);
      setcurrentTaskID(null);
    } catch (error) {
      console.error("Görev Güncellenemedi: ", error);
    }
      /*try{
        const updatedTask = {
          id: currentTaskID,
          title: taskdata.title,
          description: taskdata.description,
          deadline: taskdata.deadline,
          isDone: tasks.find(t => t.id === currentTaskID).isDone // mevcut isDone durumunu koru
        };
        await axios.put("https://localhost:7204/api/Todo/" + currentTaskID, updatedTask);
        fetchTasks(); // güncellendikten sonra güncel görevleri tekrar çekmek için
        setshowmodal(false); //güncellendikten sonra modalı kapattık
        settaskdata({title: '', description: '', deadline: ""}); //formu temizledik
        setisEditing(false); // düzenleme modunu kapat
        setcurrentTaskID(null); // geçerli görev ID'sini sıfırla
      } catch (error) {
        console.error("Görev Güncellenemedi: ", error);
      }*/}
  

     const toggleDone = async (task) => {
      /*try{
        const updatedStatus = !task.isDone;
        await axios.patch(`https://localhost:7204/api/Todo/${task.id}`, { isDone: updatedStatus });
        fetchTasks(); // durum güncellendikten sonra güncel görevleri tekrar çekmek için
      } catch (error) {
        console.error("Görev Durumu Güncellenemedi: ", error);
      }*/
     try {
      await axios.patch(`${baseUrl}/${task.id}`);
      fetchTasks();
    } catch (error) {
      console.error("Durum Güncellenemedi: ", error);
    }
    };
    
  
    const sortedTasks = [...tasks].sort((a,b) => {
      if(sortBy === "deadline") {return new Date(a.deadline) - new Date(b.deadline);}
      return b.id -a.id;});
      
    const getStatusText = (deadline) => {
      if(!deadline) return "Süresiz";
      const now = new Date();
      const deadlineDate = new Date(deadline);
      const remaining = deadlineDate.getTime() - now.getTime();
      if(remaining <= 0) return "Süresi Doldu";
      const minutes = Math.floor((remaining / (1000*60))%60);
      const hours = Math.floor(remaining / (1000 * 60 * 60)%24);
      const days = Math.floor(remaining/(1000*60*60*24))
      let status = "";
      if (days > 0) status += `${days} gün `;
      if (hours > 0) status += `${hours} saat `;
      if (minutes > 0) status += `${minutes} dakika `;
      
      return status.trim() + " kaldı";
    };
  
    if (!userId) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }
  
  return (<DashboardView 
    tasks={tasks}
      showmodal={showmodal}
      setshowmodal={setshowmodal}
      taskdata={taskdata}
      settaskdata={settaskdata}
      isEditing={isEditing}
      currentTaskID={currentTaskID}
      openAddModal={openAddModal}
      openEditModal={openEditModal}
      saveTask={saveTask}
      updateTask={updateTask}
      deleteTask={deleteTask}
      clearAll={clearAll}
      clearCompleted={clearCompleted}
      toggleDone={toggleDone}
      sortedTasks={sortedTasks}
      getStatusText={getStatusText}
      sortBy={sortBy}
      setsortBy={setsortBy}
      onLogout={handleLogout}
  />
);}


export default App;

