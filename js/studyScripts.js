document.querySelectorAll('.method-card button').forEach(button => {
    button.addEventListener('click', (e) => {
      const target = e.target;
      target.innerText = 'Loading...';
      target.disabled = true;
      setTimeout(() => {
        window.location.href = target.getAttribute('onclick').match(/'([^']+)'/)[1];
      }, 1000); // Simulate loading time
    });
  });




