// Logout seguro: remove token do localStorage e cookie Authorization
document.addEventListener('DOMContentLoaded', function () {
	const logoutLinks = document.querySelectorAll('a[href="/logout"]');
	logoutLinks.forEach(link => {
		link.addEventListener('click', function () {
			localStorage.removeItem('token');
			document.cookie = 'Authorization=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
		});
	});
});
