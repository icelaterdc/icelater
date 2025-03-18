import { useRouter } from 'next/router';

export default function DiscordCardRaw() {
  const router = useRouter();
  const { image } = router.query;

  // image parametresi yoksa basit bir uyarı göster
  if (!image || typeof image !== 'string') {
    return <div>Resim bulunamadı.</div>;
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Discord Kartı - Raw Image</h1>
      <img
        src={image}
        alt="Discord Card"
        style={{ maxWidth: '100%', border: '1px solid #555', borderRadius: '10px' }}
      />
    </div>
  );
}
