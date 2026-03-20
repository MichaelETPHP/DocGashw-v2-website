<script>
  import { onMount } from 'svelte';
  
  let visible = false;
  
  function checkVisibility() {
    const element = document.getElementById('team');
    if (!element) return;
    
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    
    if (rect.top <= windowHeight * 0.75) {
      visible = true;
    }
  }
  
  onMount(() => {
    window.addEventListener('scroll', checkVisibility);
    checkVisibility(); // Check on mount
    
    return () => {
      window.removeEventListener('scroll', checkVisibility);
    };
  });
  
  const team = [
    {
      name: "Dr. Gashaw Arega",
      role: "Pediatric Hematology Oncologist",
      bio: "Dr. Gashaw Arega specializes in pediatric blood cancer and neuroblastoma research. He leads the chemotherapy team at Black Lion Hospital and provides personalized care for children with cancer.",
      image: "/images/dr-gasah-profile.jpg"
    },
    {
      name: "Nurse Anmut T",
      role: "Senior Oncology Nurse",
      bio: "Nurse Anmut is a dedicated pediatric oncology nurse with extensive experience in chemotherapy administration. She provides compassionate care and support for patients and their families.",
      image: "/images/team-member3.svg"
    }
  ];
</script>

<section id="team" class="section bg-gray-50">
  <div class="container-custom">
    <div class="text-center mb-12">
      <h2 class="section-title relative inline-block">
        Chemotherapy Team
        <span class="absolute bottom-0 left-0 w-full h-1 bg-blue-600"></span>
      </h2>
      <p class="section-subtitle max-w-3xl mx-auto">
        Our specialized team is dedicated to providing comprehensive care for children with cancer at Black Lion Hospital.
      </p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {#each team as member, index}
        <div 
          class="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
          class:opacity-0={!visible}
          class:opacity-100={visible}
          style="transition-delay: {index * 200}ms"
        >
          <div class="h-64 overflow-hidden">
            <img 
              src={member.image} 
              alt={member.name} 
              class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div class="p-6">
            <h3 class="text-xl font-semibold text-blue-900 mb-1 relative inline-block">
              {member.name}
              <span class="absolute bottom-0 left-0 w-3/4 h-0.5 bg-blue-600"></span>
            </h3>
            <p class="text-blue-600 font-medium mb-3">{member.role}</p>
            <p class="text-gray-600">{member.bio}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .opacity-0 {
    opacity: 0;
    transform: translateY(20px);
  }
  
  .opacity-100 {
    opacity: 1;
    transform: translateY(0);
  }
</style>