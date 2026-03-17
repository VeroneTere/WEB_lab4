import MealTable from '../components/MealTable';

function Nutrition() {
  return (
    <section style={{ padding: '40px 5%' }}>
      <div style={{ textAlign: 'center', marginBottom: '35px' }}>
        <h2 style={{ fontSize: '2rem', color: '#4a148c', margin: 0 }}>
          Раціон та харчування
        </h2>
        <p style={{ color: '#666', marginTop: '8px' }}>
          Плануй харчування та контролюй калорії
        </p>
      </div>
      <MealTable />
    </section>
  );
}

export default Nutrition;