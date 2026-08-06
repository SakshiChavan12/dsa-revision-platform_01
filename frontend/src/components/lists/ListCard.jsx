import Badge from '../common/Badge';

const ListCard = ({ list }) => {
  return (
    <div className="card-glow p-5 w-full relative group transition-all duration-200 hover:border-purple-500/50">
      <div className="flex justify-between items-start mb-4 border-b border-[#2D2D3D] pb-4">
        <div>
          <h3 className="text-white font-medium text-base">{list.name}</h3>
          <p className="text-sm text-gray-400">{list.count} questions</p>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors">
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </button>
      </div>

      <div className="space-y-3 mb-4">
        {list.questions.slice(0, 5).map((q, idx) => (
          <div key={idx} className="flex justify-between items-center text-sm hover:bg-[#0B0C10] p-1.5 -mx-1.5 rounded transition-colors cursor-pointer">
            <span className="text-gray-300 truncate min-w-0 overflow-hidden text-ellipsis pr-4">{q.title}</span>
            <Badge variant={q.difficulty.toLowerCase()}>{q.difficulty}</Badge>
          </div>
        ))}
        {list.questions.length > 5 && (
          <div className="text-xs text-gray-500 pl-1.5">+ {list.questions.length - 5} more...</div>
        )}
      </div>

      <button className="w-full py-2 mt-auto border border-[#2D2D3D] border-dashed rounded-lg text-gray-400 hover:text-white hover:border-purple-500/50 hover:bg-[#0B0C10] transition-all text-sm flex items-center justify-center gap-2">
        <i className="fa-regular fa-plus"></i> Add Question
      </button>
    </div>
  );
};

export default ListCard;