interface StatisticCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
  badge?: string
  secondaryIcon?: React.ReactNode
}

const StatisticCard = ({ title, value, icon, color, badge, secondaryIcon }: StatisticCardProps) => (
  <div
    className={`group relative overflow-hidden rounded-2xl border border-${color}-500/20 bg-linear-to-br from-${color}-500/10 to-${color === 'cyan' ? 'blue' : color === 'green' ? 'emerald' : color === 'purple' ? 'pink' : 'orange'}-500/10 p-6 shadow-2xl backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-${color}-500/20`}
  >
    <div className={`absolute top-0 right-0 h-32 w-32 rounded-full bg-${color}-500/10 blur-3xl`} />
    <div className="relative">
      <div className="mb-4 flex items-center justify-between">
        <div className={`rounded-xl border border-${color}-500/30 bg-${color}-500/20 p-3`}>{icon}</div>
        {badge ? (
          <div className={`rounded-full bg-${color}-500/20 px-2 py-1 text-xs font-semibold text-${color}-300`}>
            {badge}
          </div>
        ) : (
          secondaryIcon
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium tracking-wider text-slate-400 uppercase">{title}</p>
        <p className="text-4xl font-bold text-white">{value}</p>
      </div>
    </div>
  </div>
)

export default StatisticCard
