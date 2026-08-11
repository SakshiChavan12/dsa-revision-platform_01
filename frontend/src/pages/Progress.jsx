import { Link } from 'react-router-dom';

import {
  FaClipboardList,
  FaCircleCheck,
  FaHourglassHalf,
  FaBullseye,
  FaCheck,
  FaXmark,
} from 'react-icons/fa6';

// ------------------------------------------
// MOCK DATA
// ------------------------------------------

const overviewStats = [
  {
    label: 'Total Questions',
    value: 25,
    color: '#22c55e',
    icon: <FaClipboardList />,
  },
  {
    label: 'Solved',
    value: 14,
    color: '#22c55e',
    icon: <FaCircleCheck />,
  },
  {
    label: 'Attempted',
    value: 18,
    color: '#f59e0b',
    icon: <FaHourglassHalf />,
  },
  {
    label: 'Accuracy',
    value: '77.8%',
    color: '#38bdf8',
    icon: <FaBullseye />,
  },
];

const todayProblems = [
  {
    id: 1,
    status: 'Solved',
    icon: <FaCheck />,
  },
  {
    id: 2,
    status: 'Wrong',
    icon: <FaXmark />,
  },
  {
    id: 3,
    status: 'Solved',
    icon: <FaCheck />,
  },
  {
    id: 4,
    status: 'Pending',
    icon: <FaHourglassHalf />,
  },
  {
    id: 5,
    status: 'Pending',
    icon: <FaHourglassHalf />,
  },
];

const weakTopics = [
  {
    name: 'Dynamic Programming',
    pct: 40,
    color: '#ef4444',
  },
  {
    name: 'Graphs',
    pct: 50,
    color: '#f97316',
  },
  {
    name: 'Array & Hashing',
    pct: 70,
    color: '#eab308',
  },
  {
    name: 'Two Pointers',
    pct: 80,
    color: '#a3e635',
  },
];

// ------------------------------------------
// HELPER
// ------------------------------------------

const getProblemLabel = (number) => {
  if (number === 1) return '1st Problem';
  if (number === 2) return '2nd Problem';
  if (number === 3) return '3rd Problem';

  return `${number}th Problem`;
};

// ------------------------------------------
// ACCURACY CHART
// ------------------------------------------

const AccuracyChart = () => {
  const data = [
    { date: '12 May', val: 65 },
    { date: '13 May', val: 82 },
    { date: '14 May', val: 88 },
    { date: '15 May', val: 70 },
    { date: '16 May', val: 83 },
    { date: '17 May', val: 55 },
    { date: '18 May', val: 85 },
  ];

  const width = 300;
  const height = 130;

  const padding = {
    top: 10,
    bottom: 25,
    left: 25,
    right: 10,
  };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxVal = 100;

  // ------------------------------------------
  // CREATE CHART POINTS
  // ------------------------------------------

  const points = data.map((item, index) => ({
    x:
      padding.left +
      (index / (data.length - 1)) * chartWidth,

    y:
      padding.top +
      chartHeight -
      (item.val / maxVal) * chartHeight,
  }));

  // ------------------------------------------
  // LINE PATH
  // ------------------------------------------

  const linePath = points
    .map((point, index) =>
      index === 0
        ? `M ${point.x} ${point.y}`
        : `L ${point.x} ${point.y}`
    )
    .join(' ');

  // ------------------------------------------
  // AREA PATH
  // ------------------------------------------

  const areaPath = `
    ${linePath}
    L ${points[points.length - 1].x} ${padding.top + chartHeight}
    L ${points[0].x} ${padding.top + chartHeight}
    Z
  `;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{
          width: '100%',
          height: 'auto',
          maxWidth: '100%',
        }}
      >
        {/* Gradient */}
        <defs>
          <linearGradient
            id="areaGrad"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor="#7c4dff"
              stopOpacity="0.3"
            />

            <stop
              offset="100%"
              stopColor="#7c4dff"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        {/* ------------------------------------------
            GRID LINES
        ------------------------------------------ */}

        {[0, 25, 50, 75, 100].map((value, index) => {
          const y =
            padding.top +
            chartHeight -
            (value / maxVal) * chartHeight;

          return (
            <line
              key={index}
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="var(--border-subtle)"
              strokeWidth="0.5"
              strokeDasharray="4"
            />
          );
        })}

        {/* ------------------------------------------
            AREA
        ------------------------------------------ */}

        <path
          d={areaPath}
          fill="url(#areaGrad)"
        />

        {/* ------------------------------------------
            LINE
        ------------------------------------------ */}

        <path
          d={linePath}
          fill="none"
          stroke="#7c4dff"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* ------------------------------------------
            DATA POINTS
        ------------------------------------------ */}

        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="3"
            fill="#ffffff"
            stroke="#7c4dff"
            strokeWidth="2"
          />
        ))}

        {/* ------------------------------------------
            X AXIS LABELS
        ------------------------------------------ */}

        {data.map((item, index) => (
          <text
            key={index}
            x={points[index].x}
            y={padding.top + chartHeight + 16}
            textAnchor="middle"
            fontSize="8"
            fill="var(--text-secondary)"
          >
            {item.date}
          </text>
        ))}
      </svg>
    </div>
  );
};

// ==========================================
// MAIN PROGRESS PAGE
// ==========================================

const Progress = () => {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        paddingBottom: '40px',
      }}
    >
      {/* ==========================================
          PAGE HEADER
      ========================================== */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '16px',
        }}
      >
        <h1
          style={{
            fontSize: '22px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          7. Track Progress
        </h1>

        <Link
          to="/practice"
          className="btn-primary"
          style={{
            padding: '8px 24px',
            fontSize: '0.9rem',
            textDecoration: 'none',
          }}
        >
          Practice Now
        </Link>
      </div>

      {/* ==========================================
          MAIN 4 COLUMN GRID
      ========================================== */}

      <div
        className="progress-grid-responsive"
        style={{
          display: 'grid',
          gridTemplateColumns:
            '1.1fr 1.1fr 1.5fr 1fr',
          gap: '16px',
        }}
      >
        {/* ==========================================
            CARD 1 - OVERVIEW
        ========================================== */}

        <div
          className="card-glow"
          style={{
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '185px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderBottom:
                '1px solid var(--border-subtle)',
              paddingBottom: '8px',
              marginBottom: '12px',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              fontWeight: '500',
            }}
          >
            Overview
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              flex: 1,
              justifyContent: 'space-around',
            }}
          >
            {overviewStats.map((stat, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',

                  borderBottom:
                    index !== overviewStats.length - 1
                      ? '1px solid var(--border-subtle)'
                      : 'none',

                  paddingBottom:
                    index !== overviewStats.length - 1
                      ? '6px'
                      : 0,

                  fontSize: '0.85rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.9rem',
                    }}
                  >
                    {stat.icon}
                  </span>

                  {stat.label}
                </div>

                <span
                  style={{
                    fontWeight: '600',
                    color: stat.color,
                  }}
                >
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ==========================================
            CARD 2 - TODAY'S PROGRESS
        ========================================== */}

        <div
          className="card-glow"
          style={{
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '185px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderBottom:
                '1px solid var(--border-subtle)',
              paddingBottom: '8px',
              marginBottom: '12px',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              fontWeight: '500',
            }}
          >
            Today's Progress
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flex: 1,
            }}
          >
            {/* DONUT CHART */}

            <div
              style={{
                position: 'relative',
                width: '80px',
                height: '80px',
                flexShrink: 0,
              }}
            >
              <svg
                viewBox="0 0 36 36"
                style={{
                  width: '100%',
                  height: '100%',
                  transform: 'rotate(-90deg)',
                }}
              >
                {/* Background Circle */}

                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--border-subtle)"
                  strokeWidth="4"
                />

                {/* Progress Circle */}

                <path
                  strokeDasharray="60, 100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="4"
                />
              </svg>

              {/* Center Text */}

              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform:
                    'translate(-50%, -50%)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    color: 'var(--text-primary)',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    lineHeight: 1,
                  }}
                >
                  3/5
                </div>

                <div
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.65rem',
                  }}
                >
                  Solved
                </div>
              </div>
            </div>

            {/* PROBLEM LIST */}

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                flex: 1,
              }}
            >
              {todayProblems.map((problem, index) => {
                const statusColor =
                  problem.status === 'Solved'
                    ? '#22c55e'
                    : problem.status === 'Wrong'
                    ? '#ef4444'
                    : '#f59e0b';

                return (
                  <div
                    key={problem.id}
                    style={{
                      display: 'flex',
                      justifyContent:
                        'space-between',
                      alignItems: 'center',
                      fontSize: '0.7rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <span>
                      {getProblemLabel(index + 1)}
                    </span>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span
                        style={{
                          color: statusColor,
                          fontSize: '0.7rem',
                          display: 'flex',
                        }}
                      >
                        {problem.icon}
                      </span>

                      <span
                        style={{
                          color: statusColor,
                        }}
                      >
                        {problem.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ==========================================
            CARD 3 - ACCURACY CHART
        ========================================== */}

        <div
          className="card-glow"
          style={{
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '185px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderBottom:
                '1px solid var(--border-subtle)',
              paddingBottom: '8px',
              marginBottom: '8px',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              fontWeight: '500',
            }}
          >
            Accuracy (Last 7 Days)
          </div>

          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'flex-end',
            }}
          >
            <AccuracyChart />
          </div>
        </div>

        {/* ==========================================
            CARD 4 - WEAK TOPICS
        ========================================== */}

        <div
          className="card-glow"
          style={{
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '185px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderBottom:
                '1px solid var(--border-subtle)',
              paddingBottom: '4px',
              marginBottom: '8px',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              fontWeight: '500',
            }}
          >
            Weak Topics
          </div>

          <div
            style={{
              fontSize: '0.65rem',
              color: 'var(--text-secondary)',
              marginBottom: '8px',
            }}
          >
            Based on your performance
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              flex: 1,
              justifyContent: 'space-between',
            }}
          >
            {weakTopics.map((topic, index) => (
              <div key={index}>
                {/* Topic Name */}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.7rem',
                    marginBottom: '2px',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--text-primary)',
                    }}
                  >
                    {topic.name}
                  </span>

                  <span
                    style={{
                      color: topic.color,
                      fontWeight: '500',
                    }}
                  >
                    {topic.pct}%
                  </span>
                </div>

                {/* Progress Bar */}

                <div
                  style={{
                    height: '4px',
                    background:
                      'var(--border-subtle)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${topic.pct}%`,
                      background: topic.color,
                      borderRadius: '2px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;