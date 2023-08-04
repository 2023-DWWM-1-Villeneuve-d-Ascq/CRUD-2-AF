// Fonction pour ouvrir la modal
const openModal = () => {
	const modal = document.getElementById('xiao');
	modal.style.display = 'block';
};

// Fonction pour fermer la modal
const closeModal = () => {
	const modal = document.getElementById('xiao');
	modal.style.display = 'none';
};

// Récupérer le bouton pour ouvrir la modal
const openModalButton = document.getElementById('add');
openModalButton.addEventListener('click', openModal);

// Récupérer le formulaire de la modal
const modalForm = document.getElementById('modalForm');
modalForm.addEventListener('submit', (event) => {
	event.preventDefault(); // Empêcher le formulaire de se soumettre normalement

	const nom = document.getElementById('nom').value;
	const prenom = document.getElementById('prenom').value;
	const adresse = document.getElementById('adresse').value;
	const code_postal = document.getElementById('cp').value;
	const ville = document.getElementById('ville').value;
	const telephone = document.getElementById('tel').value;
	const email = document.getElementById('email').value;

	const newUser = {
		nom,
		prenom,
		adresse,
		code_postal,
		ville,
		telephone,
		email,
	};

	fetch('http://localhost:8000/register', {
		method: 'POST',
		body: JSON.stringify(newUser),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((data) => {
			console.log('Utilisateur ajouté:', data);
			closeModal(); // Fermer la modal après avoir ajouté l'utilisateur
			refreshTable(); // Rafraîchir le tableau après l'ajout de l'utilisateur
		})
		.catch((error) => {
			console.error("Erreur lors de l'ajout de l'utilisateur:", error);
		});
});

function fetchUsersData() {
	fetch('http://localhost:8000/all')
		.then((response) => response.json())
		.then((data) => {
			console.log('Utilisateurs:', data);
			// Tableau HTML
			const tableUser = document.getElementById('userList');

			tableUser.innerHTML = '';

			data.forEach((user) => {
				const row = document.createElement('tr');
				row.innerHTML = `
					<td>${user.nom}</td>
					<td>${user.prenom}</td>
					<td>${user.adresse}</td>
					<td>${user.code_postal}</td>
					<td>${user.ville}</td>
					<td>${user.telephone}</td>
					<td>${user.email}</td>
          <td>
          <button class="btn btn-outline-primary btnEdit" data-id="${user.id}" data-toggle="modal" data-target="#modalEditClient">Modifier</button>
          </td>
					<td>
          <button class="btn btn-outline-danger btnDelete" data-id="${user.id}">Supprimer</button>
					</td>
				`;

				// Ajouter les gestionnaires d'événements pour les boutons "Modifier" et "Supprimer"
				const btnEdit = row.querySelector('.btnEdit');
				btnEdit.addEventListener('click', openEditUserModal);
				tableUser.appendChild(row); // Ajouter la ligne au tableau
			});
		})
		.catch((error) => {
			console.error('Erreur lors de la récupération des utilisateurs:', error);
		});
}
// Fonction pour ouvrir le modal de modification d'utilisateur
function openEditUserModal(event) {
	const userId = event.target.dataset.id;

	fetch(`http://localhost:8000/user/${userId}`)
		.then((response) => response.json())
		.then((data) => {
			const user = data[0]; // Accéder à la première entrée du tableau

			if (
				user.nom &&
				user.prenom &&
				user.adresse &&
				user.code_postal &&
				user.ville &&
				user.telephone &&
				user.email
			) {
				document.getElementById('editLastName').value = user.nom;
				document.getElementById('editFirstName').value = user.prenom;
				document.getElementById('editAddress').value = user.adresse;
				document.getElementById('editZipCode').value = user.code_postal;
				document.getElementById('editCity').value = user.ville;
				document.getElementById('editPhone').value = user.telephone;
				document.getElementById('editEmail').value = user.email;

				// Définir l'ID de l'utilisateur dans le bouton "Modifier" du modal de modification
				const id = user.id;
				document.getElementById('btnValidateEdit').dataset.id = id;
			} else {
				console.error("Les données de l'utilisateur sont incomplètes ou non définies.");
			}
		})
		.catch((error) => {
			console.error("Erreur lors de la récupération des données de l'utilisateur:", error);
		});
}

function deleteUser(event) {
	const userId = event.target.dataset.id;

	// Afficher une boîte de dialogue de confirmation
	if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
		// Effectuer la requête DELETE vers votre API pour supprimer l'utilisateur
		fetch(`http://localhost:8000/user/${userId}`, {
			method: 'DELETE',
		})
			.then((response) => response.json())
			.then((data) => {
				console.log('Utilisateur supprimé:', data);
			})
			.catch((error) => {
				console.error("Erreur lors de la suppression de l'utilisateur:", error);
			});
	}
}

fetchUsersData();
