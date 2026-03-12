import React from "react";

const DashboardView = ({tasks,            // Tüm görev listesi
  showmodal,        // Modal görünürlük durumu
  setshowmodal,     // Modal açma/kapama fonksiyonu
  taskdata,         // Formdaki veriler (title, desc, deadline)
  settaskdata,      // Formu güncelleme fonksiyonu
  isEditing,        // Düzenleme modu
  currentTaskID,    // Düzenlenen görevin ID'si
  openAddModal,     // Yeni ekleme penceresini açan 
  openEditModal,    // Düzenleme penceresini açan 
  saveTask,         // POST (Ekleme) fonksiyonu
  updateTask,       // PUT (Güncelleme) fonksiyonu
  deleteTask,       // DELETE (Tekli silme) fonksiyonu
  clearAll,         // DELETE (Hepsini sil) fonksiyonu
  clearCompleted,   // DELETE (Tamamlananları sil) fonksiyonu
  toggleDone,       // PATCH (Durum güncelleme) fonksiyonu
  sortedTasks,      // Sıralanmış liste
  getStatusText,    // Kalan süre metni fonksiyonu
  sortBy,           // Sıralama türü (deadline/id)
  setsortBy,  
  onLogout      // Sıralama türünü değiştirme
}) => {
    return(
        <div className ="dashboard-container">
            {/*sol panel içerisinde olanlar */}
            <div className = "Left-Panel">
                <h2>Kontrol Paneli</h2>
                <button className="add-task-button" onClick={openAddModal}>+ Yeni Görev Ekle</button>
                <div className="bulk-actions">
                    <button className="clear-button" onClick={clearCompleted}>Tamamlananları Temizle</button>
                    <button className="clear-all-button" onClick={clearAll}>Tümünü Temizle</button>

                    <button 
                        className="clear-button" 
                        onClick={onLogout} 
                        style={{ marginTop: '20px', color: '#c0392b', borderColor: '#c0392b' }}
                    >
                        Oturumu Kapat
                    </button>
                </div>
            </div>
            {/*sağ panel içerisindekiler */}
            <div className ="Right-Panel">
            {/*Devam edenler için */}
            <section>
                <div className="section-header">
                    <h2 className="section-title">Görev Listesi</h2>
                    <select onChange = {(e) => setsortBy(e.target.value)} className="sort-select" value={sortBy}>
                        <option value = "deadline">Kalan Süre</option>
                        <option value = "id">Eklenme Tarihi</option>
                    </select>
                </div>
                <div className="task-list">
                    {sortedTasks.filter(t=> !t.isDone).map(task => (
                        <div key={task.id} className="task-box">
                            <div className = "status-icon" onClick={() => toggleDone(task)}></div>
                            <div className="task-text">
                                <strong>{task.title}</strong>
                                <p>{task.description}</p>
                                <small>
                                    Kalan Süre: {getStatusText(task.deadline)}
                                    {getStatusText(task.deadline) === "Süre Doldu" && "⚠️"}
                                </small>
                            </div>
                            <div className="task-actions">
                                <span className="edit-icons" onClick={() => openEditModal(task)}>⋮</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            {/* Completed olanlar için */}
            {/*<section className="completed-sections">
                <h2 className="section-title">Tamamlanan görevler</h2>
                <div className="task-list">
                    {sortedTasks.filter(t=> t.isDone).map(task => (
                        <div key={task.id} className="task-box done">
                            <div className = "status-icon done" onClick={() => toggleDone(task)}>✓</div>
                            <div className="task-text">
                                <strong>{task.title}</strong>
                            </div>
                            <div className="task-actions">
                                <span className="delete-icon" onClick={() => deleteTask(task.id)}>🗑️</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>*/}
        {/* Completed olanlar için */}
            <section className="completed-sections">
                <h2 className="section-title">Tamamlanan görevler</h2>
                <div className="task-list">
                    {sortedTasks.filter(t=> t.isDone).map(task => (
                        <div key={task.id} className="task-box done">
                            {/* Tıklayınca tekrar toggleDone fonksiyonunu çağırıyoruz */}
                            <div className="status-icon done" onClick={() => toggleDone(task)}>✓</div>
                            <div className="task-text">
                                <strong>{task.title}</strong>
                            </div>
                            <div className="task-actions">
                                <span className="delete-icon" onClick={() => deleteTask(task.id)}>🗑️</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            </div>
            {/* Modal sectionları */}
            {showmodal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{isEditing ? "Görevi Düzenle" : "Yeni Görev Oluştur"}</h3>
                        <div className="modal-inputs">
                            <label>Başlık</label>
                            <input 
                                type="text"
                                value={taskdata.title}
                                onChange={(e) => settaskdata({...taskdata, title: e.target.value})}
                            />
                            <label>Açıklama</label>
                            <textarea
                                value={taskdata.description}
                                onChange={(e) => settaskdata({...taskdata, description: e.target.value})}
                            ></textarea>
                            <label>Kalan Süre</label>
                            <input 
                                type="datetime-local"
                                value={taskdata.deadline}
                                onChange={(e) => settaskdata({...taskdata, deadline: e.target.value})}
                            />
                        </div>
                        <div className="modal-buttons">
                            <button className="save-btn" onClick={isEditing ? updateTask : saveTask}>
                                {isEditing ? "Güncelle" : "Ekle"}
                            </button>
                            <button className="close-btn" onClick={() => setshowmodal(false)}>İptal</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

    export default DashboardView;
        

        