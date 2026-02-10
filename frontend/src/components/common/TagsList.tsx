const TagsList = ({ tags }: { tags: string[] }) => {
  return (
    <div className="mt-8 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag} className="rounded-full bg-cyan-900/30 px-3 py-1 text-xs font-medium text-cyan-300">
          #{tag}
        </span>
      ))}
    </div>
  )
}

export default TagsList
