<script>
  import HeroPro from "$lib/components/HeroPro.svelte";
  import About from "$lib/components/About.svelte";
  import Services from "$lib/components/Services.svelte";
  import Research from "$lib/components/Research.svelte";
  import Locations from "$lib/components/Locations.svelte";
  import Contact from "$lib/components/Contact.svelte";
  import AwardNotification from "$lib/components/AwardNotification.svelte";
</script>

<svelte:head>
  <title>Dr. Gashaw Arega | Pediatric Oncologist | Fighting Childhood Cancer in Ethiopia</title>
  <meta name="description" content="Dr. Gashaw Arega - Board-certified pediatric hematologist-oncologist specializing in childhood blood cancers, neuroblastoma, and pediatric solid tumors at Tikur Anbessa Hospital, Addis Ababa." />
  <meta name="keywords" content="pediatric oncologist, childhood cancer, Ethiopia, blood cancer, neuroblastoma, Wilms tumor, leukemia, lymphoma" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
</svelte:head>

<HeroPro />
<About />
<Services />
<Research />
<Locations />
<Contact />
<AwardNotification />
