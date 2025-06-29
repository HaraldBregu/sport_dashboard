import { forwardRef, useImperativeHandle, useState } from 'react'
import TextEditor from '@/components/texteditor/text-editor'
import {
  ContextBubble,
  ContextBubbleProvider,
  ContextBubbleFormattingGroup,
  ContextBubbleAlignmentGroup,
  ContextBubbleLinksGroup,
  ContextBubbleListsGroup,
  ContextBubbleHeadingsGroup,
  ContextBubbleSeparator,
  ContextBubbleSubmenu,
  ContextBubbleSubmenuTrigger,
  useContextBubble
} from '@/components/texteditor/context-bubble'
import { ChevronRight, Minus, Palette } from 'lucide-react'

const testContent = {
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": null
      },
      "content": [
        {
          "type": "text",
          "text": "Sure! Here's a "
        },
        {
          "type": "text",
          "marks": [
            {
              "type": "bold"
            }
          ],
          "text": "very long article"
        },
        {
          "type": "text",
          "text": " on a topic that offers depth and breadth:"
        },
        {
          "type": "hardBreak"
        },
        {
          "type": "text",
          "marks": [
            {
              "type": "bold"
            }
          ],
          "text": "\"The Future of Human-Technology Interaction: Merging Intelligence, Emotion, and Ethics\""
        }
      ]
    },
    {
      "type": "horizontalRule"
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": null,
        "level": 1
      },
      "content": [
        {
          "type": "text",
          "text": "The Future of Human-Technology Interaction: Merging Intelligence, Emotion, and Ethics"
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": null,
        "level": 2
      },
      "content": [
        {
          "type": "text",
          "text": "Introduction"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": null
      },
      "content": [
        {
          "type": "text",
          "text": "The trajectory of human-technology interaction (HTI) is evolving faster than ever before. From the early days of mechanical interfaces to today's conversational AI, humans and machines have grown closer, forging relationships that were once considered science fiction. With the advent of artificial intelligence (AI), machine learning, brain-computer interfaces, and emotional recognition systems, the boundary between user and device is no longer merely functional — it is emotional, behavioral, and increasingly ethical."
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": null
      },
      "content": [
        {
          "type": "text",
          "text": "As we move further into the 21st century, the convergence of intelligence, emotion, and ethics is shaping not just how we use technology but how we co-exist with it. This article explores this future in depth, analyzing historical trends, current innovations, philosophical implications, and speculative but plausible outcomes of our intertwined destiny with intelligent machines."
        }
      ]
    },
    {
      "type": "horizontalRule"
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": null,
        "level": 2
      },
      "content": [
        {
          "type": "text",
          "text": "1. Historical Overview: From Tools to Partners"
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": null,
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "1.1 The Mechanical Age"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": null
      },
      "content": [
        {
          "type": "text",
          "text": "Human interaction with tools began with the most rudimentary of objects — stone hammers, spears, and wheels. These tools extended human capacity but required direct input and physical manipulation. The industrial revolution introduced machinery that replaced muscle power with steam and coal, leading to large-scale automation. Still, the relationship was purely operational — man controlled machine."
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": null,
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "1.2 The Digital Transition"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": null
      },
      "content": [
        {
          "type": "text",
          "text": "The mid-20th century marked the transition to digital computing. Human-technology interaction shifted from physical levers to command-line interfaces, and later, to graphical user interfaces (GUIs). Personal computers revolutionized productivity, and software began mediating between human intention and machine execution."
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": null,
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "1.3 The Rise of the Internet and Mobile Revolution"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": null
      },
      "content": [
        {
          "type": "text",
          "text": "The internet, followed by mobile computing, reshaped how we interacted with the world and each other. Smartphones turned passive users into always-connected entities, accessing and sharing data at will. Human attention became a resource, and technology began to respond more dynamically to our habits, preferences, and even emotions."
        }
      ]
    },
    {
      "type": "horizontalRule"
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": null,
        "level": 2
      },
      "content": [
        {
          "type": "text",
          "text": "2. Present-Day Innovations in HTI"
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": null,
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "2.1 Conversational AI and Natural Language Interfaces"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": null
      },
      "content": [
        {
          "type": "text",
          "text": "From Apple's Siri to OpenAI's ChatGPT, conversational AI has taken center stage in HTI. Voice assistants have enabled hands-free interaction, while large language models (LLMs) like GPT-4.5 can generate human-like responses with impressive fluency. These models are now embedded in daily life — in smartphones, cars, customer support systems, and even therapy bots."
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": null,
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "2.2 Wearables and Biofeedback"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": null
      },
      "content": [
        {
          "type": "text",
          "text": "Devices like Apple Watch, Fitbit, Oura Ring, and various medical sensors have bridged the gap between biological signals and digital systems. Wearables continuously track metrics like heart rate, sleep, stress levels, and physical activity. When connected to health platforms, they facilitate preventative care and real-time interventions."
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": null,
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "2.3 Augmented and Virtual Reality"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": null
      },
      "content": [
        {
          "type": "text",
          "text": "AR and VR technologies have enhanced HTI by creating immersive environments. In industries ranging from gaming to education to medical surgery, these tools allow users to interact with digital objects as though they were real. Meta's push into the metaverse, although met with mixed reception, underlines the ambition to make digital experience as visceral as the physical world."
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": null,
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "2.4 Emotion Recognition Systems"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": null
      },
      "content": [
        {
          "type": "text",
          "text": "Through facial recognition, vocal analysis, and physiological signals, AI can now infer emotional states with growing accuracy. This has applications in marketing, education, human resources, and even law enforcement — though it raises significant ethical concerns."
        }
      ]
    },
    {
      "type": "horizontalRule"
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": null,
        "level": 2
      },
      "content": [
        {
          "type": "text",
          "text": "3. Future Directions and Challenges"
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": null,
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "3.1 Brain-Computer Interfaces (BCIs)"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": null
      },
      "content": [
        {
          "type": "text",
          "text": "Companies like Neuralink are developing BCIs that allow direct communication between the brain and external devices. The potential benefits include treating neurological disorders, enabling communication for locked-in patients, and even augmenting cognition. However, BCIs also present risks related to privacy, consent, and the commodification of thought."
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": null,
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "3.2 Sentient and Empathic Machines"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": null
      },
      "content": [
        {
          "type": "text",
          "text": "The question of machine consciousness remains theoretical, but machines are increasingly capable of simulating empathy. Empathic AI might be used in eldercare, education, and therapy, tailoring its responses to the user's emotional state. Yet, simulated empathy could also be manipulated to create false relationships, as seen in parasocial interactions with chatbots or AI companions."
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": null,
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "3.3 AI and Decision-Making: Delegating Judgment"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": null
      },
      "content": [
        {
          "type": "text",
          "text": "From hiring decisions to criminal sentencing, AI is already involved in decisions with real human consequences. The opacity of many algorithms, combined with inherent biases in training data, raises questions about accountability and fairness. As we allow AI to \"think\" for us, we must reconsider the role of human agency."
        }
      ]
    },
    {
      "type": "horizontalRule"
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": null,
        "level": 2
      },
      "content": [
        {
          "type": "text",
          "text": "4. The Emotional Fabric of Future Interactions"
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": null,
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "4.1 Trust and Dependence"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": null
      },
      "content": [
        {
          "type": "text",
          "text": "For technology to truly integrate into our lives, trust must be earned and maintained. Yet, as systems become more complex, users may not understand their inner workings. This creates a paradox: we trust systems we can't explain — a phenomenon known as \"automation bias.\" This can lead to over-reliance and complacency."
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": null,
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "4.2 Emotional Design"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": null
      },
      "content": [
        {
          "type": "text",
          "text": "Future HTI will prioritize emotional resonance. Design philosophies such as \"calm technology\" aim to minimize distraction, while \"affective computing\" aims to enhance emotional intelligence. Devices may soon adapt their interfaces based on the user's mood — dimming lights, adjusting voice tone, or switching to simplified UI during stress."
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": null,
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "4.3 Digital Companionship"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": null
      },
      "content": [
        {
          "type": "text",
          "text": "Social robots and virtual companions, from Sony's Aibo to Replika AI, offer companionship that blurs the line between tool and friend. In a world increasingly marked by loneliness and social fragmentation, these technologies offer comfort. But at what cost? Do they satisfy emotional needs, or do they deepen disconnection from other humans?"
        }
      ]
    },
    {
      "type": "horizontalRule"
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": null,
        "level": 2
      },
      "content": [
        {
          "type": "text",
          "text": "5. Ethics at the Core"
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": null,
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "5.1 Privacy and Consent"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": null
      },
      "content": [
        {
          "type": "text",
          "text": "Emotion-aware systems and biometric sensors collect deeply personal data. Who owns this data? How is consent obtained when technology becomes ambient — listening, watching, and interpreting constantly? Regulation often lags innovation, leaving users exposed."
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": null,
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "5.2 Bias and Inclusion"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": null
      },
      "content": [
        {
          "type": "text",
          "text": "Bias in AI is not a bug — it is a reflection of the data and systems created by humans. If not addressed, HTI risks reinforcing structural inequalities. Future design must prioritize inclusive datasets and user-centered development."
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": null,
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "5.3 The Right to Disconnect"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": null
      },
      "content": [
        {
          "type": "text",
          "text": "As HTI becomes more pervasive, maintaining boundaries becomes essential. The always-on culture can lead to burnout and mental fatigue. Future technologies must include mechanisms for intentional disconnection and support digital well-being."
        }
      ]
    },
    {
      "type": "horizontalRule"
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": null,
        "level": 2
      },
      "content": [
        {
          "type": "text",
          "text": "6. Philosophical Reflections: What Does It Mean to Be Human?"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": null
      },
      "content": [
        {
          "type": "text",
          "text": "As machines grow more \"intelligent\" and emotionally aware, we are forced to ask: what remains uniquely human? Is it creativity? Empathy? Morality? Or is it the very ambiguity and unpredictability of human thought? Philosophers and technologists alike debate whether we are engineering our successors — or merely building better mirrors of ourselves."
        }
      ]
    },
    {
      "type": "horizontalRule"
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": null,
        "level": 2
      },
      "content": [
        {
          "type": "text",
          "text": "7. Speculative Scenarios for 2050"
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": null,
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "7.1 Symbiotic Interfaces"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": null
      },
      "content": [
        {
          "type": "text",
          "text": "Humans and AI may develop a symbiotic relationship, with thought-controlled digital assistants anticipating needs and augmenting memory, creativity, and productivity. Education and work may become personalized at an unprecedented scale."
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": null,
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "7.2 Ethical AI Mediators"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": null
      },
      "content": [
        {
          "type": "text",
          "text": "AI could act as ethical advisors, helping individuals and institutions navigate complex moral dilemmas. These systems might analyze societal impact, individual values, and long-term consequences to offer insight — though not answers."
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": null,
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "7.3 Global Empathy Networks"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": null
      },
      "content": [
        {
          "type": "text",
          "text": "Imagine a world where real-time emotional data from millions of people is anonymously aggregated to guide humanitarian response, political decisions, or climate action. Emotion could become a data layer — influencing policy through compassion-driven analytics."
        }
      ]
    },
    {
      "type": "horizontalRule"
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": null,
        "level": 2
      },
      "content": [
        {
          "type": "text",
          "text": "Conclusion"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": null
      },
      "content": [
        {
          "type": "text",
          "text": "The future of human-technology interaction is not just about smarter systems — it's about more human systems. Systems that understand, respect, and augment the complex fabric of our minds, bodies, and societies. The convergence of intelligence, emotion, and ethics is both a challenge and an opportunity — demanding vigilance, imagination, and humility."
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": null
      },
      "content": [
        {
          "type": "text",
          "text": "Whether we build machines that enslave us, liberate us, or become us will depend not on technology alone, but on the values we embed within it today."
        }
      ]
    },
    {
      "type": "horizontalRule"
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": null
      },
      "content": [
        {
          "type": "text",
          "text": "If you want this turned into a formatted PDF, broken into slides, or adapted for a specific audience (like a TED talk, business strategy doc, or educational material), just let me know!"
        }
      ]
    }
  ]
}

export interface ContentRef {
  focus: () => void
}

type ContentProps = {
  placeholder: string
}

const Content = forwardRef<ContentRef, ContentProps>(({ placeholder }, ref) => {

  useImperativeHandle(ref, () => ({
    focus: () => {
      console.log('focus')
    },
  }))

  const [contextBubble, setContextBubble] = useState<{ x: number; y: number } | null>(null)
  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null)

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault()

    // Check if there's selected text
    const selection = window.getSelection()
    if (selection && !selection.isCollapsed) {
      // Text is selected, show context bubble
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()

      // Store the selection rect for dynamic positioning
      setSelectionRect(rect)

      // Position bubble initially at a safe location
      const initialX = rect.left + rect.width / 2
      const initialY = rect.top - 10

      setContextBubble({ x: initialX, y: initialY })
    }
    // If no text is selected, don't show the context bubble
  }

  // Color palettes
  const textColors = ["#000000", "#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"]
  const highlightColors = ["#fef3c7", "#fecaca", "#fed7d7", "#e0e7ff", "#d1fae5", "#fce7f3", "#f3e8ff", "#e5e7eb"]

  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="grid grid-cols-2 gap-4 h-full">
          <div
            className="h-full"
            onContextMenu={handleContextMenu}
          >
            <TextEditor
              placeholder={placeholder}
              className="h-full"
              content={testContent}
            />
          </div>
          <div
            className="h-full"
            onContextMenu={handleContextMenu}
          >
            <TextEditor
              placeholder={placeholder}
              className="h-full"
              content={testContent}
            />
          </div>
        </div>
      </div>

      {contextBubble && (
        <ContextBubbleProvider
          isOpen={!!contextBubble}
          position={contextBubble}
          selectionRect={selectionRect}
          onClose={() => {
            setContextBubble(null)
            setSelectionRect(null)
          }}
        >
          <ContextBubble variant="floating">
            <ContextBubbleFormattingGroup />
            <ContextBubbleSeparator />
            <ContextBubbleAlignmentGroup />
            <ContextBubbleSeparator />
            <ContextBubbleLinksGroup />
            <ContextBubbleSeparator />
            <ContextBubbleListsGroup />
            <ContextBubbleSeparator />
            <ContextBubbleHeadingsGroup />
            <ContextBubbleSeparator />

            {/* Font Sizes */}
            <div className="flex items-center gap-1 p-1">
              <button className="h-8 px-2 text-xs hover:bg-accent rounded-sm transition-colors">
                8pt
              </button>
              <button className="h-8 px-2 text-sm hover:bg-accent rounded-sm transition-colors">
                26pt
              </button>
              <button className="h-8 px-2 text-base hover:bg-accent rounded-sm transition-colors">
                90pt
              </button>
            </div>

            <ContextBubbleSeparator />

            {/* Menu Items with Submenus */}
            <div className="space-y-1">
              {/* Text Colors */}
              <ContextBubbleSubmenuTrigger submenu="colors">
                <div className="flex items-center">
                  <Palette className="mr-2 h-4 w-4" />
                  Text Color
                </div>
                <ChevronRight className="h-4 w-4" />
              </ContextBubbleSubmenuTrigger>

              {/* Highlight Colors */}
              <ContextBubbleSubmenuTrigger submenu="highlight">
                <div className="flex items-center">
                  <Palette className="mr-2 h-4 w-4" />
                  Highlight Color
                </div>
                <ChevronRight className="h-4 w-4" />
              </ContextBubbleSubmenuTrigger>

              {/* Remove Formatting */}
              <ContextBubbleSubmenuTrigger submenu="remove">
                <div className="flex items-center">
                  <Minus className="mr-2 h-4 w-4" />
                  Remove Formatting
                </div>
                <ChevronRight className="h-4 w-4" />
              </ContextBubbleSubmenuTrigger>
            </div>
          </ContextBubble>

          {/* Submenus */}
          <ContextBubbleSubmenus
            textColors={textColors}
            highlightColors={highlightColors}
          />
        </ContextBubbleProvider>
      )}
    </>
  )
})

Content.displayName = 'Content'

// Submenu component
function ContextBubbleSubmenus({
  textColors,
  highlightColors
}: {
  textColors: string[]
  highlightColors: string[]
}) {
  const { showSubmenu, onClose, position } = useContextBubble()

  const getSubmenuPosition = () => {
    // Calculate submenu position based on available space
    const submenuWidth = 140 // Approximate width of submenu
    const submenuHeight = 120 // Approximate height of submenu

    let left = position.x + 200 // Default: position to the right
    let top = position.y

    // Check if submenu would overflow right edge
    if (left + submenuWidth > window.innerWidth) {
      left = position.x - submenuWidth - 10 // Position to the left instead
    }

    // Check if submenu would overflow bottom edge
    if (top + submenuHeight > window.innerHeight) {
      top = window.innerHeight - submenuHeight - 10
    }

    // Ensure minimum distance from edges
    left = Math.max(10, left)
    top = Math.max(10, top)

    return {
      position: 'fixed' as const,
      left,
      top,
      zIndex: 60
    }
  }

  if (showSubmenu === 'colors') {
    return (
      <ContextBubbleSubmenu style={getSubmenuPosition()}>
        <div className="grid grid-cols-4 gap-1.5">
          {textColors.map((color) => (
            <button
              key={color}
              className="w-7 h-7 rounded border border-gray-300 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              onClick={() => {
                // editor.chain().focus().setColor(color).run()
                console.log('Set text color:', color)
                onClose()
              }}
              title={`Set text color to ${color}`}
            />
          ))}
        </div>
      </ContextBubbleSubmenu>
    )
  }

  if (showSubmenu === 'highlight') {
    return (
      <ContextBubbleSubmenu style={getSubmenuPosition()}>
        <div className="grid grid-cols-4 gap-1.5">
          {highlightColors.map((color) => (
            <button
              key={color}
              className="w-7 h-7 rounded border border-gray-300 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              onClick={() => {
                // editor.chain().focus().setHighlight(color).run()
                console.log('Set highlight color:', color)
                onClose()
              }}
              title={`Set highlight color to ${color}`}
            />
          ))}
        </div>
      </ContextBubbleSubmenu>
    )
  }

  if (showSubmenu === 'remove') {
    return (
      <ContextBubbleSubmenu style={getSubmenuPosition()}>
        <div className="space-y-1">
          <button
            className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded-sm transition-colors"
            onClick={() => {
              // editor.chain().focus().unsetColor().run()
              console.log('Remove text color')
              onClose()
            }}
          >
            Remove Text Color
          </button>
          <button
            className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded-sm transition-colors"
            onClick={() => {
              // editor.chain().focus().unsetHighlight().run()
              console.log('Remove highlight')
              onClose()
            }}
          >
            Remove Highlight
          </button>
          <button
            className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded-sm transition-colors"
            onClick={() => {
              // editor.chain().focus().clearNodes().unsetAllMarks().run()
              console.log('Remove all formatting')
              onClose()
            }}
          >
            Remove All Formatting
          </button>
        </div>
      </ContextBubbleSubmenu>
    )
  }

  return null
}

export default Content
