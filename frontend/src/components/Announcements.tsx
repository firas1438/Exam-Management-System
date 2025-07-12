type AnnouncementsProps = {
  data: any[];
};
const Announcements = ({ data }: AnnouncementsProps) => {
  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Logs</h1>
        <span className="text-xs text-gray-400">View All</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
  {data && data.map((item: { action: string; timestamp: string; userName: string; description: string }, index) => {
    // Déterminer la classe de fond en fonction du type d'action
    const bgColorClass = {
      'Modification': 'bg-lamaSkyLight',
      'Ajout': 'bg-lamaPurpleLight',
      'Suppression': 'bg-lamaYellowLight'
    }[item.action] || 'bg-gray-100';

  return (
    <div key={index} className={`${bgColorClass} rounded-md p-4 mb-4`}>
      <div className="flex items-center justify-between">
        <h2 className="font-medium">{item.action}</h2>
        <span className="text-xs text-red-700 bg-white rounded-md px-1 py-1">
          {item.timestamp.slice(0, 10)} <br/> {item.timestamp.slice(11, 16)}
        </span>
      </div>
      <p className="text-sm text-gray-400 mt-1">
         {item.description}
      </p>
    </div>
  );
})}

      </div>
    </div>
  );
};

export default Announcements;
