import { NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgClass, NgFor, NgIf, ReactiveFormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  @ViewChild('mainNav') mainNav!: ElementRef;
  images: string[] = []
  selectedService: number = 0;
  contactForm!: FormGroup;
  successMessage: string | undefined;
  errorMessage: string | undefined;
  loading: boolean = false
  constructor(private fb: FormBuilder, private http: HttpClient) { }
  ngOnInit(): void {
    this.setImagesArray()
    this.setForm()
    this.shrinkNavbar();
    window.addEventListener('scroll', this.shrinkNavbar.bind(this));
    this.activateScrollspy();
    this.collapseResponsiveNavbar();
  }
  setForm() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      message: ['', Validators.required]
    });
  }
  shrinkNavbar() {
    if (!this.mainNav.nativeElement) {
      return;
    }
    if (window.scrollY === 0) {
      this.mainNav.nativeElement.classList.remove('navbar-shrink');
    } else {
      this.mainNav.nativeElement.classList.add('navbar-shrink');
    }
  }

  activateScrollspy() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('#mainNav a');

    const observerOptions = {
      rootMargin: '0px',
      threshold: 0.7,
    };

    const observerCallback = (entries: any[], observer: any) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const targetId = entry.target.getAttribute('id');
          const activeLink = document.querySelector(`#mainNav a[href="#${targetId}"]`);

          navLinks.forEach((link) => {
            link.classList.remove('active');
          });

          if (activeLink) {
            activeLink.classList.add('active');
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((section) => {
      observer.observe(section);
    });
  }

  collapseResponsiveNavbar() {
    const navbarToggler = document.body.querySelector('.navbar-toggler') as HTMLButtonElement;
    const responsiveNavItems = Array.from(
      document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.forEach(responsiveNavItem => {
      responsiveNavItem.addEventListener('click', () => {
        if (getComputedStyle(navbarToggler).display !== 'none') {
          navbarToggler.click();
        }
      });
    });
  }

  setSelectedService(index: number) {
    this.selectedService = index
  }
  setImagesArray() {
    this.images = Array.from({ length: 46 }, (_, i) => `image_${i + 1}.jpg`);
  }
  submitForm() {
    if (this.contactForm.valid) {
      this.loading = true
      // this.successMessage = 'Form submission successful!';
      // this.errorMessage = '';
      const formData = new FormData();
      formData.append('wpforms[fields][0][first]', this.contactForm.get('name')?.value);
      formData.append('wpforms[fields][0][last]', '');
      formData.append('wpforms[fields][1]', this.contactForm.get('email')?.value);
      formData.append('wpforms[fields][2]', this.contactForm.get('message')?.value);
      formData.append('wpforms[id]', '292');
      formData.append('wpforms[author]', '2');
      formData.append('wpforms[post_id]', '8');
      formData.append('wpforms[submit]', 'wpforms-submit');
      formData.append('wpforms[token]', 'ef8f630892fa9ccb788f4fe4936061a0');
      formData.append('action', 'wpforms_submit');
      formData.append('page_url', 'https://asalatalkhafji.com/');
      formData.append('page_title', 'Home');
      formData.append('page_id', '8');
      formData.append('start_timestamp', '1709179962825');
      formData.append('end_timestamp', '1709179974251');

      this.http.post('https://asalatalkhafji.com/wp-admin/admin-ajax.php', formData)
        .subscribe({
          next: (response) => {
            console.log('Form submission successful!', response);
            this.successMessage = 'Form submission successful!';
            this.errorMessage = '';
            this.loading = false;
          },
          error: (error) => {
            console.error('Error sending message!', error);
            this.successMessage = '';
            this.errorMessage = 'Error sending message!';
            this.loading = false;
          }
        });

    } else {
      this.successMessage = '';
      this.errorMessage = 'Error sending message!';
    }
  }
}
