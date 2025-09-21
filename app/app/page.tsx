import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function ChatMainPage() {
  return (
    <div className="h-screen bg-white text-gray-900 flex flex-col font-poppins">
      {/* Header */}
      <header className="bg-white p-4 sticky top-0 z-20 border-b border-gray-200">
        <div className="container mx-auto flex flex-col items-center max-w-5xl">
          <div className="text-sm text-gray-600 text-center">Ontario, Canada | Federal Election 2025</div>
        </div>
      </header>

      {/* Main Content Area - Scrollable */}
      <ScrollArea className="flex-grow w-full max-w-5xl mx-auto">
        <div className="p-3 flex flex-col gap-6">

          {/* Sample Current Question and Response */}
          <div className="space-y-4">
            {/* Sample User Question */}
            <div className="flex justify-end w-full">
              <div className="bg-blue-500 text-white p-4 rounded-lg max-w-xs sm:max-w-sm md:max-w-md shadow-sm">
                <p className="whitespace-pre-line font-poppins">What are the candidates' positions on healthcare?</p>
              </div>
            </div>

            {/* Sample Response */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Candidate 1 Column */}
              <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <CardHeader className="border-b border-gray-200 p-4">
                  <CardTitle className="text-blue-600 text-lg font-semibold font-poppins">LIBERAL CANDIDATE</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="text-sm text-gray-900 whitespace-pre-line min-h-[100px] font-poppins">
                    <p>The Liberal candidate supports expanding universal healthcare coverage, including dental care and pharmacare programs. They propose increased federal funding for healthcare infrastructure and mental health services.</p>
                    
                    <p className="mt-3">Key policy points:</p>
                    <ul className="list-disc pl-6 mt-2">
                      <li>Universal dental care program</li>
                      <li>National pharmacare initiative</li>
                      <li>Increased healthcare worker training</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Candidate 2 Column */}
              <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <CardHeader className="border-b border-gray-200 p-4">
                  <CardTitle className="text-red-600 text-lg font-semibold font-poppins">CONSERVATIVE CANDIDATE</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="text-sm text-gray-900 whitespace-pre-line min-h-[100px] font-poppins">
                    <p>The Conservative candidate focuses on healthcare efficiency and reducing wait times through public-private partnerships. They emphasize provincial autonomy in healthcare delivery.</p>
                    
                    <p className="mt-3">Key policy points:</p>
                    <ul className="list-disc pl-6 mt-2">
                      <li>Reduce healthcare bureaucracy</li>
                      <li>Support private healthcare options</li>
                      <li>Improve healthcare technology</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sample Previous Q&A Pair */}
          <div className="space-y-4 border-t border-gray-200 pt-4 opacity-75 hover:opacity-100 transition-opacity">
            {/* Previous Question */}
            <div className="flex justify-end w-full">
              <div className="bg-slate-50 text-slate-700 p-3 rounded-lg max-w-xs sm:max-w-sm md:max-w-md shadow-sm border">
                <p className="whitespace-pre-line text-sm">What is their stance on climate change?</p>
                <div className="text-xs text-gray-500 mt-2">
                  2:35 PM
                </div>
              </div>
            </div>

            {/* Previous Response */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Previous Candidate 1 */}
              <Card className="bg-gray-50 border-gray-200 rounded-lg shadow-sm">
                <CardHeader className="border-b border-gray-200 p-3">
                  <CardTitle className="text-blue-500 text-sm">LIBERAL CANDIDATE</CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="text-xs text-gray-700 whitespace-pre-line">
                    <p>Supports aggressive climate action with net-zero emissions by 2050. Proposes carbon pricing and green infrastructure investments.</p>
                  </div>
                </CardContent>
              </Card>

              {/* Previous Candidate 2 */}
              <Card className="bg-gray-50 border-gray-200 rounded-lg shadow-sm">
                <CardHeader className="border-b border-gray-200 p-3">
                  <CardTitle className="text-purple-500 text-sm">CONSERVATIVE CANDIDATE</CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="text-xs text-gray-700 whitespace-pre-line">
                    <p>Emphasizes technology-driven climate solutions and supports energy sector transition while maintaining economic competitiveness.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Scroll Controls */}
      <div className="fixed bottom-24 right-6 md:right-10 z-40 flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10 bg-white/80 backdrop-blur shadow-md hover:bg-gray-100 border border-gray-300"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-5 w-5 text-gray-700" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10 bg-white/80 backdrop-blur shadow-md hover:bg-gray-100 border border-gray-300"
          aria-label="Scroll to bottom"
        >
          <ChevronDown className="h-5 w-5 text-gray-700" />
        </Button>
      </div>

      {/* Chat Input Bar */}
      <footer className="bg-white p-4 sticky bottom-0 z-10 border-t border-gray-200">
        <div className="container mx-auto flex flex-col gap-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <Input
            placeholder="Type your question here... (e.g., What are the candidate's views on healthcare?)"
            className="flex-grow bg-transparent border-none text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none shadow-none font-poppins"
          />
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Select>
                <SelectTrigger className="w-auto md:w-[150px] bg-white border border-gray-300 text-gray-900 text-xs md:text-sm p-2 h-9 md:h-10 font-poppins">
                  <SelectValue placeholder="Canada" />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-900 border border-gray-300 z-[50]">
                  <SelectItem value="Canada" className="hover:bg-gray-100 focus:bg-gray-100 font-poppins">
                    Canada
                  </SelectItem>
                  <SelectItem value="USA" className="hover:bg-gray-100 focus:bg-gray-100 font-poppins">
                    USA
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-full md:w-[180px] bg-white border border-gray-300 text-gray-900 text-xs md:text-sm p-2 h-9 md:h-10 font-poppins">
                  <SelectValue placeholder="Ontario" />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-900 border border-gray-300 z-[50]">
                  <SelectItem value="Ontario" className="hover:bg-gray-100 focus:bg-gray-100 font-poppins">Ontario</SelectItem>
                  <SelectItem value="Quebec" className="hover:bg-gray-100 focus:bg-gray-100 font-poppins">Quebec</SelectItem>
                  <SelectItem value="British Columbia" className="hover:bg-gray-100 focus:bg-gray-100 font-poppins">British Columbia</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-full md:w-[180px] bg-white border border-gray-300 text-gray-900 text-xs md:text-sm p-2 h-9 md:h-10 font-poppins">
                  <SelectValue placeholder="Federal Election 2025" />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-900 border border-gray-300 z-[50]">
                  <SelectItem value="Federal Election 2025" className="hover:bg-gray-100 focus:bg-gray-100 font-poppins">Federal Election 2025</SelectItem>
                  <SelectItem value="General Election" className="hover:bg-gray-100 focus:bg-gray-100 font-poppins">General Election</SelectItem>
                  <SelectItem value="Provincial Election" className="hover:bg-gray-100 focus:bg-gray-100 font-poppins">Provincial Election</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              className="p-2 aspect-square rounded-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}