function Services() {
  const services = [
    { name: 'Bill Pay', icon: '💸', description: 'Pay your bills easily' },
    { name: 'Money Transfer', icon: '🔄', description: 'Send money to anyone' },
    { name: 'Tax Services', icon: '📊', description: 'Tax calculation & filing' },
    { name: 'Insurance', icon: '🛡️', description: 'Get insured today' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service, index) => (
          <div key={index} className="card bg-base-100 shadow">
            <div className="card-body">
              <div className="flex items-center gap-4">
                <div className="text-3xl">{service.icon}</div>
                <div>
                  <h3 className="card-title">{service.name}</h3>
                  <p>{service.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;