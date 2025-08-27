# doubtful

A small React + TypeScript component library for managing and displaying doubts and questions of anyone on anything using Solid Pods and the CRMinf ontology.

## Build


```bash
npm install
npm run build
```

## Usage

```tsx
function App() {
	return (
		<SolidAuthProvider>
			<DoubtProvider>
				<Doubts about="[URI of the proposition which should be doubted or questioned]" />
			</DoubtProvider>
		</SolidAuthProvider>
	)
}
```
