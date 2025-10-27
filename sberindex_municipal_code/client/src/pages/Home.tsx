import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, MapPin, TrendingUp } from "lucide-react";

interface MunicipalityData {
  "Муниципалитет": string;
  "Пригород (30-40 мин)": boolean;
  "Арктическая зона": boolean;
  "Выручка на чел.": number;
  "Прибыль на чел.": number;
  "Инвестиции на чел.": number;
  "Фед. ритейл": number;
  "Доступность д/с": number;
  "Доступность ПМП": number;
  "Спорт. объекты": number;
}

export default function Home() {
  const [data, setData] = useState<MunicipalityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "suburb" | "arctic">("all");

  useEffect(() => {
    fetch("/data.csv")
      .then((res) => res.text())
      .then((csv) => {
        const lines = csv.trim().split("\n");
        const headers = lines[0].split(",");
        const parsed = lines.slice(1).map((line) => {
          const values = line.split(",");
          return headers.reduce((obj, header, i) => {
            const value = values[i]?.trim();
            if (header === "Пригород (30-40 мин)" || header === "Арктическая зона") {
              obj[header] = value === "True" || value === "true";
            } else if (header === "Фед. ритейл") {
              obj[header] = parseInt(value) || 0;
            } else if (header !== "Муниципалитет") {
              obj[header] = parseFloat(value) || 0;
            } else {
              obj[header] = value;
            }
            return obj;
          }, {} as any);
        });
        setData(parsed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading data:", err);
        setLoading(false);
      });
  }, []);

  const filteredData = data.filter((item) => {
    if (filter === "suburb") return item["Пригород (30-40 мин)"];
    if (filter === "arctic") return item["Арктическая зона"];
    return true;
  });

  const stats = {
    total: filteredData.length,
    avgRevenue: (filteredData.reduce((sum, d) => sum + (d["Выручка на чел."] || 0), 0) / filteredData.length).toFixed(0),
    avgProfit: (filteredData.reduce((sum, d) => sum + (d["Прибыль на чел."] || 0), 0) / filteredData.length).toFixed(0),
    avgInvestments: (filteredData.reduce((sum, d) => sum + (d["Инвестиции на чел."] || 0), 0) / filteredData.length).toFixed(0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-green-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-green-700">Муниципальный код</h1>
              <p className="text-gray-600 mt-1">Связанные вместе: анализ взаимосвязей в арктических муниципалитетах</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Конкурс СберИндекса</p>
              <p className="text-xs text-gray-400">Номинация: Визуализация данных и инфографика</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Introduction */}
        <section className="mb-12 bg-white rounded-lg p-8 border border-green-100 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">О проекте</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Этот проект анализирует взаимосвязь между экономическим развитием, инфраструктурой и качеством жизни в арктических муниципалитетах России. 
            Мы исследуем, как близость к крупным городам влияет на экономическую активность и развитие социальной инфраструктуры.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Используя данные СберИндекса, Проектного офиса развития Арктики (ПОРА) и открытых источников, мы выявляем паттерны развития и факторы, 
            определяющие успех муниципалитетов в условиях арктической экономики.
          </p>
        </section>

        {/* Statistics Cards */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Ключевые метрики</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Всего муниципалитетов</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-700">{stats.total}</div>
              </CardContent>
            </Card>
            <Card className="bg-white border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Средняя выручка на чел.</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-700">{stats.avgRevenue}</div>
                <p className="text-xs text-gray-500 mt-1">руб.</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Средняя прибыль на чел.</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-700">{stats.avgProfit}</div>
                <p className="text-xs text-gray-500 mt-1">руб.</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Средние инвестиции на чел.</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-700">{stats.avgInvestments}</div>
                <p className="text-xs text-gray-500 mt-1">руб.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Visualizations */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Анализ данных</h2>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-green-100">
              <TabsTrigger value="overview" className="text-green-700">Обзор</TabsTrigger>
              <TabsTrigger value="comparison" className="text-green-700">Сравнение</TabsTrigger>
              <TabsTrigger value="data" className="text-green-700">Данные</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card className="bg-white border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    Сравнение экономических показателей
                  </CardTitle>
                  <CardDescription>
                    Анализ различий в экономической активности между пригородами и удаленными муниципалитетами
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <img src="/economic_comparison.png" alt="Economic Comparison" className="w-full rounded-lg" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comparison" className="mt-6">
              <Card className="bg-white border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-600" />
                    Географическое распределение
                  </CardTitle>
                  <CardDescription>
                    Анализ влияния географического положения на экономические показатели
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h3 className="font-semibold text-gray-800 mb-2">Пригороды (30-40 мин от крупного города)</h3>
                      <p className="text-sm text-gray-700">
                        Муниципалитеты в пригородных зонах показывают более высокую экономическую активность благодаря близости к крупным городам и доступу к рынкам.
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-gray-800 mb-2">Арктические муниципалитеты</h3>
                      <p className="text-sm text-gray-700">
                        Муниципалитеты в Арктической зоне РФ сталкиваются с уникальными вызовами, включая суровый климат, удаленность и ограниченную инфраструктуру. 
                        Однако они часто имеют высокий потенциал благодаря природным ресурсам и специальным программам развития.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data" className="mt-6">
              <Card className="bg-white border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Исходные данные
                  </CardTitle>
                  <CardDescription>
                    Таблица с основными показателями для каждого муниципалитета
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex gap-2">
                    <Button 
                      variant={filter === "all" ? "default" : "outline"}
                      onClick={() => setFilter("all")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Все ({data.length})
                    </Button>
                    <Button 
                      variant={filter === "suburb" ? "default" : "outline"}
                      onClick={() => setFilter("suburb")}
                      className={filter === "suburb" ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      Пригороды ({data.filter(d => d["Пригород (30-40 мин)"]).length})
                    </Button>
                    <Button 
                      variant={filter === "arctic" ? "default" : "outline"}
                      onClick={() => setFilter("arctic")}
                      className={filter === "arctic" ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      Арктика ({data.filter(d => d["Арктическая зона"]).length})
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-green-100 border-b border-green-200">
                        <tr>
                          <th className="text-left px-4 py-2 font-semibold text-gray-700">Муниципалитет</th>
                          <th className="text-right px-4 py-2 font-semibold text-gray-700">Выручка</th>
                          <th className="text-right px-4 py-2 font-semibold text-gray-700">Прибыль</th>
                          <th className="text-right px-4 py-2 font-semibold text-gray-700">Инвестиции</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.slice(0, 10).map((item, i) => (
                          <tr key={i} className="border-b border-gray-200 hover:bg-green-50">
                            <td className="px-4 py-2 text-gray-700">{item["Муниципалитет"]}</td>
                            <td className="text-right px-4 py-2 text-gray-700">{item["Выручка на чел."].toFixed(0)}</td>
                            <td className="text-right px-4 py-2 text-gray-700">{item["Прибыль на чел."].toFixed(0)}</td>
                            <td className="text-right px-4 py-2 text-gray-700">{item["Инвестиции на чел."].toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredData.length > 10 && (
                      <p className="text-xs text-gray-500 mt-4 text-center">Показаны первые 10 из {filteredData.length} муниципалитетов</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Conclusions */}
        <section className="mb-12 bg-white rounded-lg p-8 border border-green-100 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Выводы</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <span className="text-green-600 font-bold">•</span>
              <span>Близость к крупным городам является значительным фактором экономического развития муниципалитетов.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold">•</span>
              <span>Арктические муниципалитеты демонстрируют разнообразие экономических моделей, от ресурсоориентированных до диверсифицированных.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold">•</span>
              <span>Инвестиции в инфраструктуру (детские сады, медицинские учреждения, спортивные объекты) коррелируют с качеством жизни.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold">•</span>
              <span>Развитие розничной торговли (федеральные сети) служит индикатором рыночной развитости и потребительской активности.</span>
            </li>
          </ul>
        </section>

        {/* Footer Info */}
        <section className="text-center py-8 border-t border-green-200">
          <p className="text-gray-600 mb-2">Данные: СберИндекс, ПОРА (Проектный офис развития Арктики)</p>
          <p className="text-gray-600 mb-4">Конкурс СберИндекса "Муниципальный код" | Номинация: Визуализация данных и инфографика</p>
          <p className="text-sm text-gray-500">Автор: Лысов Илья</p>
        </section>
      </main>
    </div>
  );
}
