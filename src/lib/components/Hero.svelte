<script>
  import { onMount } from 'svelte';
  let ready = false;

  onMount(() => {
    // Use requestAnimationFrame to trigger the transition as soon as possible after mount
    requestAnimationFrame(() => {
      ready = true;
    });
  });
</script>

<section id="home" class="relative min-h-[100dvh] bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 overflow-hidden">
  <!-- Background with mesh gradient and subtle pattern -->
  <div class="absolute inset-0">
    <div class="absolute inset-0 bg-blue-900/30 backdrop-blur-sm"></div>
    <div class="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
  </div>

  <!-- Hero Content -->
  <div class="container mx-auto px-4 pt-16 pb-8 h-[100dvh] flex flex-col justify-between relative z-10">
    <!-- Main content area -->
    <div class="flex flex-col md:flex-row items-center justify-center flex-grow gap-8 md:gap-12">
      <!-- Text Content -->
      <div class="space-y-5 md:space-y-6 max-w-xl text-center md:text-left md:w-1/2 pt-8 md:pt-0"
           class:opacity-0={!ready} class:opacity-100={ready}
           style="transition: opacity 0.8s ease-out, transform 0.8s ease-out; transform: translateY({ready ? '0' : '30px'})">
        
        <!-- Name with highlight effect -->
        <div class="relative inline-block">
          <span class="absolute -inset-1 blur-xl bg-blue-400/20 rounded-lg"></span>
          <h1 class="relative text-4xl md:text-5xl lg:text-7xl font-bold text-white font-noto leading-tight">
            Dr. Gashaw Arega
          </h1>
        </div>
        
        <h2 class="text-xl md:text-2xl lg:text-3xl font-medium text-white/90">
          <span class="text-blue-200">MD, MPH</span> | Specialist in Pediatrics & Child Health
        </h2>
        <h3 class="text-xl md:text-2xl lg:text-3xl font-medium text-white/90">
          <span class="text-blue-200">የህፃናት የደም ተያያዥ ህመሞች እና የህፃናት ካንሰር ህክምና ሰብ ስፔሻሊስት</span>
        </h3>
        
        <p class="text-base md:text-lg lg:text-xl text-blue-100 max-w-xl leading-relaxed">
          Dedicated to advancing care and research in pediatric blood cancers and neuroblastoma in Ethiopia.
        </p>
        
        <div class="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
          <a href="#contact" 
             class="btn bg-white text-blue-900 hover:bg-blue-50 py-3 px-6 md:py-3 md:px-8 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Book Appointment
          </a>
          <a href="#about" 
             class="btn border-2 border-white text-white hover:bg-white/10 py-3 px-6 md:py-3 md:px-8 rounded-full transition-all duration-300 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Learn More
          </a>
        </div>
      </div>

      <!-- Image Section -->
      <div class="relative md:w-1/2 mt-8 md:mt-0">
        <div class="w-full max-w-md mx-auto">
          <!-- Decorative elements behind image -->
          <div class="hidden md:block absolute -top-6 -left-6 w-24 h-24 rounded-full bg-blue-500/20 backdrop-blur-sm"></div>
          <div class="hidden md:block absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-blue-400/20 backdrop-blur-sm"></div>
          
          <!-- Profile image with frame -->
          <div class="relative p-2 md:p-3 bg-gradient-to-br from-white/30 to-white/5 backdrop-blur-md rounded-2xl shadow-2xl">
            <img 
              src="/images/dr-gasah-profile.jpg" 
              alt="Dr. Gashaw Arega"
              loading="eager"
              decoding="async"
              fetchpriority="high"
              class="w-full h-auto rounded-xl object-cover relative z-10"
            />
          
            <!-- Certification Badge -->
            <div class="absolute -right-4 -top-4 bg-blue-600 text-white p-3 rounded-full shadow-lg z-20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>

          <!-- Floating Icons with Glass Effect -->
          <div class="absolute -left-2 md:-left-6 top-1/4 animate-float z-20">
            <div class="bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </div>
          </div>

          <div class="absolute -right-2 md:-right-6 top-1/3 animate-float-delayed z-20">
            <div class="bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </div>
          </div>

          <!-- Reviews Card -->
          <div class="absolute right-0 -bottom-6 md:right-8 md:bottom-0 bg-white/90 backdrop-blur-lg p-3 md:p-4 rounded-xl shadow-lg animate-fade-in z-20 transform hover:scale-105 transition-transform duration-300">
            <div class="flex items-center gap-3">
              <div class="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-inner">
                GA
              </div>
              <div>
                <p class="font-medium text-blue-900">Top Specialist</p>
                <div class="flex text-yellow-400 text-sm">★★★★★</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Scroll Indicator -->
    <div class="mt-8 flex justify-center">
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