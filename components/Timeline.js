import { formatCurrency, formatDate } from '../lib/financeUtils';
import './Timeline.css';

export default function Timeline({ events = [] }) {
  if (events.length === 0) {
    return <div className="timeline-empty">No upcoming items</div>;
  }

  // Group by date
  const grouped = {};
  events.forEach(event => {
    const dateKey = event.date.toDateString();
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(event);
  });

  return (
    <div className="timeline">
      {Object.entries(grouped).map(([dateKey, dayEvents]) => (
        <div key={dateKey} className="timeline-day">
          <div className="timeline-date">{formatDate(dateKey)}</div>
          <div className="timeline-events">
            {dayEvents.map((event, idx) => (
              <div key={idx} className={`timeline-item ${event.category}`}>
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>{event.name}</h4>
                  <div className={`timeline-amount ${event.category}`}>
                    {event.category === 'income' ? '+' : ''}{formatCurrency(Math.abs(event.amount))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
