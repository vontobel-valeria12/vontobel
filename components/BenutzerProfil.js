// Vorher:
const { logout } = useAuth(); 
// Nachher:
const { abmelden } = useAuth();

// Und im Button:
<button onClick={abmelden}>Abmelden</button>