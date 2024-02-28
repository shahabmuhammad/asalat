import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NgClass, NgFor, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  @ViewChild('mainNav') mainNav!: ElementRef;
  images:string[] = []
  selectedService: number = 0;
  ngOnInit(): void {
    this.setImagesArray()
    this.shrinkNavbar();
    window.addEventListener('scroll', this.shrinkNavbar.bind(this));
    this.activateScrollspy();
    this.collapseResponsiveNavbar();
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
  setImagesArray(){
    this.images = Array.from({ length: 46 }, (_, i) => `image_${i + 1}.jpg`);
    console.log(this.images)
  }
  getImageUrl(image: string): string {
    return `../assets/img/success-patner/${image}`;
  }
}
