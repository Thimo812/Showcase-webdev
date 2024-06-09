import UserListItem from "../components/UserListItem.js";

class UserManager {

    listElement = document.querySelector(".userList");

    constructor() {
        this.loadListData();
    }

    async loadListData() {
        const response = await fetch('https://localhost:7241/api/User/GetAllUsers', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('bearer-token')}` 
            },
        });

        if (response.status != 200) window.location.hash = '#cv';
        const userData = await response.json();
        console.log(userData)

        for (let user of userData) {
            const item = new UserListItem(user.userName, user.id, user.role);
            this.listElement.appendChild(item);
        }
    }
}

const userManager = new UserManager();