// Initialize Netlify Identity
    if (window.netlifyIdentity) {
      netlifyIdentity.init();
      netlifyIdentity.on('login', function(user) {
        netlifyIdentity.close();
        window.location.href = '/admin/index.html';
      });
      netlifyIdentity.on('error', function(err){
        console.error('Netlify Identity error:', err);
      });
    }

    var form = document.getElementById('loginForm');
    var errEl = document.getElementById('errorMsg');

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var email = document.getElementById('email').value.trim();
      var password = document.getElementById('password').value.trim();
      if(!email || !password){
        errEl.style.display = 'block';
        return;
      }
      errEl.style.display = 'none';

      // Netlify Identity: try programmatic login; otherwise open modal
      if (window.netlifyIdentity && typeof netlifyIdentity.login === 'function') {
        netlifyIdentity.login(email, password).catch(function(err){
          errEl.textContent = 'Login gagal — periksa kredensial Anda.';
          errEl.style.display = 'block';
        });
      } else if (window.netlifyIdentity) {
        // Prefill email then open the modal
        netlifyIdentity.open('login');
      } else {
        // Fallback: redirect to admin for demo purposes
        window.location.href = '/admin/index.html';
      }
    });