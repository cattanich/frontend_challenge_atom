import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
/* Eliminado import de Angular Material para evitar errores */
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  // Eliminado styleUrls para evitar error por falta de hoja de estilos
  // styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    const email = this.loginForm.value.email;
    this.userService.getUserByEmail(email).subscribe(user => {
      console.log('Usuario recibido en login:', user);
      console.log('Propiedades del usuario:', Object.keys(user || {}));
      if (user) {
        localStorage.setItem('userId', user.email);
        localStorage.setItem('userEmail', user.email);
        this.router.navigate(['/tasks']);
      } else {
        // Usar confirmación nativa en lugar de diálogo de Angular Material
        const confirmed = window.confirm(`El usuario con correo ${email} no existe. ¿Desea crearlo?`);
        if (confirmed) {
          this.userService.createUser(email).subscribe(createdUser => {
            localStorage.setItem('userId', createdUser.email);
            localStorage.setItem('userEmail', createdUser.email);
            this.router.navigate(['/tasks']);
          });
        }
      }
    });
  }
}
