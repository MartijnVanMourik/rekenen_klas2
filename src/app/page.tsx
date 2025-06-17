import MathLearningApp from '@/components/MathLearningApp'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6">
            <span className="text-3xl">🧮</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Rekenmaatje
          </h1>
          
          <p className="text-xl text-blue-700 font-medium mb-6">
            Leer rekenen op een leuke manier! Herhaalcursus rekenen voor leerlingen havo en vwo van klas 2.
          </p>
        </div>

        {/* Main App */}
        <MathLearningApp />
      </div>
    </div>
  )
}