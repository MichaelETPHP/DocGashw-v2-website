<script>
  import { onMount } from 'svelte';
  let ready = false;

  onMount(() => {
    ready = true;
  });
</script>

<section id="home" class="relative min-h-screen bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 overflow-hidden">
  <div class="absolute inset-0 bg-blue-900/30 backdrop-blur-sm"></div>

  <div class="container mx-auto px-4 h-screen flex items-center relative z-10">
    <div class="grid md:grid-cols-2 gap-12 items-center w-full">
      <!-- Text Content -->
      <div class="space-y-6 max-w-xl" class:opacity-0={!ready} class:opacity-100={ready}>
        <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white font-noto animate-fade-in">
          Dr. Gashaw A
        </h1>
        <h2 class="text-2xl md:text-3xl font-medium text-white/90 animate-slide-up">
          MD, MPH | Specialist in Pediatrics & Child Health
        </h2>
        <p class="text-lg md:text-xl text-blue-100 max-w-xl leading-relaxed">
          Dedicated to advancing care and research in pediatric blood cancers and neuroblastoma in Ethiopia.
        </p>
        <div class="flex flex-wrap gap-4 pt-4">
          <a href="#contact" 
             class="btn bg-white text-blue-900 hover:bg-blue-50 py-3 px-8 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Book Appointment
          </a>
          <a href="#about" 
             class="btn border-2 border-white text-white hover:bg-white/10 py-3 px-8 rounded-full transition-all duration-300">
            Learn More
          </a>
        </div>
      </div>

      <!-- Image Section -->
      <div class="relative">
        <div class="w-full max-w-lg mx-auto">
          <img 
            src="/images/dr-gasah-profile.jpg" 
            alt="Dr. Gasah A"
            loading="eager"
            decoding="async"
            fetchpriority="high"
            class="w-full h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500 relative z-10"
          />

          <!-- Floating Icons with Glass Effect -->
          <div class="absolute -left-4 top-1/4 animate-float z-20">
            <div class="bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </div>
          </div>

          <div class="absolute -right-4 top-1/3 animate-float-delayed z-20">
            <div class="bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </div>
          </div>

          <!-- Stats Card -->
          <div class="absolute right-8 bottom-8 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg animate-fade-in z-20">
            <div class="flex items-center gap-3">
              <img src="/images/dr-gasah-profile.jpg" alt="Dr. Gshaw" class="w-10 h-10 rounded-full ring-2 ring-blue-500"/>
              <div>
                <p class="font-medium text-blue-900">Dr. Gshaw</p>
                <div class="flex text-yellow-400 text-sm">★★★★★</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Scroll Indicator -->
  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
    <a href="#about" 
       class="flex flex-col items-center text-white group">
      <span class="text-sm font-medium mb-2 opacity-80 group-hover:opacity-100 transition-opacity">
        Scroll Down
      </span>
      <div class="w-8 h-12 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
        <div class="w-1 h-3 bg-white rounded-full animate-bounce"></div>
      </div>
    </a>
  </div>
</section>

<style>
  .animate-float {
    animation: float 4s ease-in-out infinite;
  }

  .animate-float-delayed {
    animation: float 4s ease-in-out infinite;
    animation-delay: 2s;
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(5deg);
    }
  }
</style>