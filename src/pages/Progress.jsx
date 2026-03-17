import ProgressForm from '../components/ProgressForm';

function Progress() {
  return (
    <section style={{ padding: '40px 5%' }}>
      <div style={{ textAlign: 'center', marginBottom: '35px' }}>
        <h2 style={{ fontSize: '2rem', color: '#4a148c', margin: 0 }}>
          Мій прогрес
        </h2>
        <p style={{ color: '#666', marginTop: '8px' }}>
          Відстежуй кроки та вагу щодня
        </p>
      </div>
      <ProgressForm />
    </section>
  );
}

export default Progress;