import { useEffect, useState } from "react";
import RoomGrid from "../components/rooms/RoomGrid";
import Modal from "../components/common/Modal";
import CheckinForm from "../components/rooms/CheckinForm";
import CheckoutForm from "../components/rooms/CheckoutForm";
import CollectMoneyForm from "../components/rooms/CollectMoneyForm";
import GuestForm from "../components/guests/GuestForm";
import api from "../api/axiosConfig";
import { fetchRooms } from "../api/rooms";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState(null);

  // Modal States
  const [checkinOpen, setCheckinOpen] = useState(false);
  const [actionChoiceOpen, setActionChoiceOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [collectOpen, setCollectOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);

  // --- NEW STATE FOR SEQUENTIAL GUESTS ---
  const [remainingGuests, setRemainingGuests] = useState(0);

  const loadRooms = async () => {
    const data = await fetchRooms();
    setRooms(data)
    console.log("Rooms data:", data); // Debugging log
  };

  useEffect(() => { loadRooms(); }, []);

  const handleRoomClick = async (room) => {
    setSelectedRoom(room);
    if (room.status === "AVAILABLE") {
      setCheckinOpen(true);
    } else {
      try {
        const res = await api.get(`/api/customers/active/${room.id}`);
        setActiveCustomer(res.data);
        setActionChoiceOpen(true);
      } catch (err) {
        console.error("Failed to fetch active customer for room", err);
        alert("Could not fetch active guest details");
      }
    }
  };

  // 1. Initial trigger after primary guest check-in
  const afterCheckin = async (customer_id) => {
    setCheckinOpen(false);
    await loadRooms();

    try {
      const res = await api.get(`/api/customers/${customer_id}`);
      const customer = res.data;

      // Calculate additional guests: Total People - 1 (the primary guest)
      const count = customer.no_of_person - 1;

      if (count > 0) {
        setNewCustomer(customer);
        setRemainingGuests(count);
        setGuestOpen(true);
      } else {
        // If only 1 person, just reset
        setSelectedRoom(null);
      }
    } catch (err) {
      console.error("Failed to fetch customer", err);
      refresh();
    }
  };

  // 2. Logic to handle sequential guest entry
  const handleNextGuest = () => {
    if (remainingGuests > 1) {
      // If more than 1 additional guest remains, decrement and keep modal open
      // The 'key' prop on GuestForm below will handle the form reset
      setRemainingGuests((prev) => prev - 1);
    } else {
      // All additional guests are done
      refresh();
    }
  };

  const openActionForm = (type) => {
    setActionChoiceOpen(false);
    if (type === 'CHECKOUT') setCheckoutOpen(true);
    if (type === 'COLLECT') setCollectOpen(true);
  };

  const refresh = () => {
    setCheckinOpen(false);
    setCheckoutOpen(false);
    setCollectOpen(false);
    setGuestOpen(false);
    setRemainingGuests(0);
    setSelectedRoom(null);
    setActiveCustomer(null);
    setNewCustomer(null);
    loadRooms();
  };

  return (
    <div style={styles.pageWrapper}>
      <RoomGrid rooms={rooms} onRoomClick={handleRoomClick} />

      {/* Choice Modal */}
      <Modal isOpen={actionChoiceOpen} onClose={() => setActionChoiceOpen(false)} title="Select Action">
        <div style={styles.choiceGrid}>
          <button onClick={() => openActionForm('COLLECT')} style={styles.collectBtn}>
            <span style={{ fontSize: "24px" }}>💰</span>
            <div style={styles.btnTextWrapper}>
              <span style={styles.btnTitle}>Collect Money</span>
              <span style={styles.btnSub}>Record a partial payment</span>
            </div>
          </button>
          <button onClick={() => openActionForm('CHECKOUT')} style={styles.checkoutBtn}>
            <span style={{ fontSize: "24px" }}>🔑</span>
            <div style={styles.btnTextWrapper}>
              <span style={styles.btnTitle}>Checkout</span>
              <span style={styles.btnSub}>Settle bill & free room</span>
            </div>
          </button>
        </div>
      </Modal>

      {/* Collect Money Modal */}
      <Modal isOpen={collectOpen} onClose={() => setCollectOpen(false)} title="Record Payment">
        {activeCustomer && <CollectMoneyForm customer={activeCustomer} onSuccess={refresh} />}
      </Modal>

      {/* Checkout Modal */}
      <Modal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} title="Finalize Checkout">
        {activeCustomer && <CheckoutForm customer={activeCustomer} onSuccess={refresh} />}
      </Modal>

      {/* Check-In Modal */}
      <Modal isOpen={checkinOpen} onClose={() => setCheckinOpen(false)} title="Check-In">
        {selectedRoom && <CheckinForm room={selectedRoom} onSuccess={afterCheckin} />}
      </Modal>

      {/* --- SEQUENTIAL ADDITIONAL GUESTS MODAL --- */}
      <Modal
        isOpen={guestOpen}
        onClose={refresh}
        title={`Additional Guest Details (${remainingGuests} Remaining)`}
      >
        {newCustomer && (
          <GuestForm
            // The 'key' forces the GuestForm to unmount and remount (clearing inputs) 
            // every time the counter changes.
            key={remainingGuests}
            customerId={newCustomer.id}
            onDone={handleNextGuest}
          />
        )}
      </Modal>
    </div>
  );
};

const styles = {
  pageWrapper: { padding: "20px", background: "#f8f9fa" },
  choiceGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", padding: "10px" },
  btnTextWrapper: { display: "flex", flexDirection: "column", alignItems: "flex-start", marginLeft: "10px" },
  btnTitle: { fontWeight: "bold", fontSize: "16px" },
  btnSub: { fontSize: "12px", color: "#666" },
  collectBtn: { padding: "20px", borderRadius: "12px", border: "2px solid #3182ce", background: "#ebf8ff", cursor: "pointer", display: "flex", alignItems: "center" },
  checkoutBtn: { padding: "20px", borderRadius: "12px", border: "2px solid #e2e8f0", background: "#fff5f5", cursor: "pointer", display: "flex", alignItems: "center" }
};

export default Rooms;