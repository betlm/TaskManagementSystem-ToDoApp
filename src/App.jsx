import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import './App.css';
import DashboardView from './DashboardView';

function App(){
  const[tasks, setTasks] = useState([]);
  const[showmodal, setshowmodal] = useState(false);
  const[taskdata, settaskdata] = useState({title: '', description: '', deadline: ""});
  const[isEditing, setisEditing] = useState(false);
  const[currentTaskID, setcurrentTaskID] = useState(null);
  const[sortBy, setsortBy] = useState("deadline");

  useEffect(() => {
    fetchTasks();
  }, []);

  /* showmodal yeni görev ekleme modal'ının görünürlüğü
     setshowmodal modal görünürlüğünü güncellemek için. yeni görev ekle butonuna basıldığı zaman
     state true olur ve modal görünür.
     
     backendden gelen tasklar ilk satırdakinin içerisinde tutulup onun üzerinden işlem yapılacak 
     
     taskdata yeni eklemeler için kaydet denildiğinde alınıp backende gönderilecek
     
     useffect -> sayfa yüklendiğinde bir iş yapma emri */

  const fetchTasks = async () => {
    try {
      const response = await axios.get("https://localhost:7204/api/Todo")
      setTasks(response.data); // backendden gelen veriler taskların içine atılır bu kısımda kullanılması için
    } catch (error) {
      console.error("Veriler Çekilemedi: ", error);
    }
  };

  //fonksiyonlar kısmı

  const openAddModal = () => { //yeni görev ekleme modalını açar
    setisEditing(false); //editing false olur çünkü ekleme yapacağız
    settaskdata({ title: "",description: "", deadline: "" }); //formu temizler
    setshowmodal(true); //modal açılır
  }

  const saveTask =async () => { //post için 
    if(!taskdata.title) return alert("Başlık boş olamaz!");
    const newTask = {
      title: taskdata.title,
      description: taskdata.description,
      deadline: taskdata.deadline,
      isDone: false
    }; // yeni görevler için taskdata tekli görevleri aldı daha sonra array içine gönderecek

    try {
      await axios.post("https://localhost:7204/api/Todo", newTask);
      await fetchTasks(); //yeni görev eklendikten sonra güncel görevleri tekrar çekmek için
      setshowmodal(false); //eklendikten sonra modalı kapattık
      settaskdata({title: '', description: '', deadline: ""}); //formu temizledik
    } catch (error) {
      console.error("Görev Eklenemedi: ", error);
    }};

  const deleteTask = async (id) => { //delete id
    if(window.confirm("Bu görevi silmek istediğinize emin misiniz?")) {
      try {
        await axios.delete("https://localhost:7204/api/Todo/" + id); // id nin olduğu kısma gidip onu siliyor
        fetchTasks(); // silindikten sonra güncel görevleri tekrar çekmek için
      } catch (error) {
        console.error("Görev Silinemedi: ", error);
      }
    }
  };

  const clearAll = async () => { //delete all
    if(window.confirm("Tüm görevleri silmek istediğinize emin misiniz?")) {
      try {
        await axios.delete("https://localhost:7204/api/Todo/ClearAll");
        setTasks([]); // tüm görevler silindikten sonra tasks dizisini boşalt
        fetchTasks(); // silindikten sonra güncel görevleri tekrar çekmek için
      } catch (error) {
        console.error("Görevler Silinemedi: ", error);
      }
    }};

    const clearCompleted = async () => { //Delete completed
      if(window.confirm("Tamamlanan görevleri silmek istediğinize emin misiniz?")) {
        try {
          await axios.delete("https://localhost:7204/api/Todo/ClearCompleted");
          setTasks(tasks.filter(t=> !t.isDone)); // tamamlanan görevler silindikten sonra tasks dizisini güncelle
          fetchTasks(); // silindikten sonra güncel görevleri tekrar çekmek için
        } catch (error) {
          console.error("Görevler Silinemedi: ", error);
        }}};

    const openEditModal = (task) =>{ //update
      setisEditing(true); //düzenleme açılıyor
      setcurrentTaskID(task.id); //güncellenecek görevin id'si tutuluyor
      settaskdata({ title: task.title,
         description: task.description, 
         deadline: task.deadline });
      setshowmodal(true); 
    };

    const updateTask = async () => {
      try{
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
      }}
  /* openeditmodal düzenleme modalını açma fonksiyonu
     setisediting true yapar yani düzenleme moduna geçer
     setcurrenttaskid ile düzenlenecek görevin idsini tutarız
     settaskdata ile o anki görevin bilgilerini alırız başlık açıklama deadline
     setshowmodal true yaparak modalı açarız
  */

     const toggleDone = async (task) => {
      try{
        const updatedStatus = !task.isDone;
        await axios.patch(`https://localhost:7204/api/Todo/${task.id}`, { isDone: updatedStatus });
        fetchTasks(); // durum güncellendikten sonra güncel görevleri tekrar çekmek için
      } catch (error) {
        console.error("Görev Durumu Güncellenemedi: ", error);
      }
    };
    
  /* toggledone görev tamamlandı işaretleme fonksiyonu
     task parametresi ile o anki görevi alırız
     updatedstatus ile o anki görevin isdone durumunu tersine çeviririz
     axios.patch ile backendde sadece isdone durumu güncellenir
     fetchtasks ile güncel görevler tekrar çekilir
  */
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
  />
);}

export default App;
  

